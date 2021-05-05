import {Contract, BigNumber, FixedNumber, utils} from 'ethers'
import {InjectedConnector} from '@web3-react/injected-connector'
import {WalletConnectConnector} from '@web3-react/walletconnect-connector'
import {flatten} from 'lodash-es'
import poolABI from './contracts/pool-abi'
import tokenABI from './contracts/token-abi'

const
    {parseEther} = utils,
    {MAINNET_URL, RINKEBY_URL, DEVCHAIN_URL, DEVCHAIN_ID} = process.env,
    {keys, values} = Object


export const connectorFactories = {
    MetaMask: () =>
        new InjectedConnector({supportedChainIds: [1, 4, Number(DEVCHAIN_ID)]}),

    WalletConnect: () =>
        new WalletConnectConnector({
            rpc: {
                1: MAINNET_URL,
                4: RINKEBY_URL,
                [DEVCHAIN_ID]: DEVCHAIN_URL,
            },
        }),
}


export const availableServices = keys(connectorFactories)


export const contractAddresses = {
    1: {
        pool: process.env.POOL_CONTRACT_ADDR_MAINNET,
        token: process.env.TOKEN_CONTRACT_ADDR_MAINNET,
    },
    4: {
        pool: process.env.POOL_CONTRACT_ADDR_RINKEBY,
        token: process.env.TOKEN_CONTRACT_ADDR_RINKEBY,
    },
    [DEVCHAIN_ID]: {
        pool: process.env.POOL_CONTRACT_ADDR_DEV,
        token: process.env.TOKEN_CONTRACT_ADDR_DEV,
    },
}


export const contractFactories = {
    pool: (chainId, signer) =>
        new Contract(contractAddresses[chainId].pool, poolABI, signer),

    token: (chainId, signer) =>
        new Contract(contractAddresses[chainId].token, tokenABI, signer),
}


const formulas = {
    apy: apr => (Math.pow(1 + Number(apr) / 1e8 / 52, 52) - 1) * 100,
}


export const stateVars = {
    api3Balance: {
        default: BigNumber.from(0),

        getter: ({contracts, account}) =>
            account
                ? contracts.token.balanceOf(account)
                : BigNumber.from(0),
    },

    poolAllowance: {
        default: BigNumber.from(0),

        getter: ({contracts, account}) =>
            account
                ? contracts.token.allowance(account, contracts.pool.address)
                : BigNumber.from(0),
    },

    stakeAmount: {
        default: BigNumber.from(0),

        getter: ({contracts, account}) =>
            account
                ? contracts.pool.userStake(account)
                : BigNumber.from(0),
    },

    depositAmount: {
        default: BigNumber.from(0),

        getter: async ({contracts, account, fromBlock}) => {
            if (!account)
                return BigNumber.from(0)

            const
                f = contracts.pool.filters,

                spec = {
                    Deposited: {op: 'add', filter: f.Deposited(account)},
                    Withdrawn: {op: 'sub', filter: f.Withdrawn(null, account)},
                    Staked:    {op: 'sub', filter: f.Staked(account)},
                    Unstaked:  {op: 'add', filter: f.Unstaked(account)},
                },

                eventGroups = await Promise.all(
                    values(spec)
                        .map(({filter}) =>
                            contracts.pool.queryFilter(filter, fromBlock)),
                ),

                events = flatten(eventGroups),

                updateAmount =
                    events.reduce(
                        (sum, e) => sum[spec[e.event].op](e.args.amount),
                        BigNumber.from(0),
                    )

            return (prevAmount = BigNumber.from(0)) =>
                prevAmount.add(updateAmount)
        },
    },

    totalStake: {
        default: BigNumber.from(0),
        getter: ({contracts}) => contracts.pool.totalStake(),
    },

    stakeTarget: {
        default: BigNumber.from(0),
        getter: ({contracts}) => contracts.pool.stakeTarget(),
    },

    targetMet: {
        default: '0.00',
        getter: async ({contracts}) => {
            const
                totalStake = await contracts.pool.totalStake(),
                stakeTarget = await contracts.pool.stakeTarget()

            if (totalStake.gte(stakeTarget))
                return '100.0'

            return FixedNumber.from(totalStake.toString())
                .mulUnsafe(FixedNumber.from(100))
                .divUnsafe(FixedNumber.from(stakeTarget.toString()))
                .round(1)
                .toString()
        },
    },

    apy: {
        default: '0.00',
        getter: async ({contracts}) =>
            formulas.apy(await contracts.pool.currentApr()).toFixed(1),
    },

    annualInflationRate: {
        default: '0.00',
        getter: async ({contracts}) => {
            const
                apy = formulas.apy(await contracts.pool.currentApr()),

                totalStake = await contracts.pool.totalStake(),
                totalSupply = await contracts.token.totalSupply(),

                annualMintedTokens =
                    FixedNumber.from(totalStake.toString())
                        .mulUnsafe(FixedNumber.from(apy.toFixed(2)))
                        .divUnsafe(FixedNumber.from(100)),

                annualInflationRate =
                    annualMintedTokens
                        .divUnsafe(
                            annualMintedTokens.addUnsafe(
                                FixedNumber.from(totalSupply.toString()))
                        )
                        .mulUnsafe(FixedNumber.from(100))
                        .round(1)
                        .toString()

            return annualInflationRate
        },
    },

    pendingUnstake: {
        default: null,

        getter: async ({contracts, address}) => {
            const
                pc = contracts.pool,

                scheduleUnstakeEvents =
                    await pc.queryFilter(pc.filters.ScheduledUnstake(address))

            if (!scheduleUnstakeEvents.length)
                return null

            const
                lastScheduleUnstakeEvent = scheduleUnstakeEvents.pop(),

                unstakeEventsAfterLastSchedule =
                    await pc.queryFilter(
                        pc.filters.Unstaked(address),
                        lastScheduleUnstakeEvent.blockNumber,
                    )

            if (unstakeEventsAfterLastSchedule.length)
                // means that there is no pending unstaking
                return null

            const
                {amount, scheduledFor} = lastScheduleUnstakeEvent.args,

                deadline = scheduledFor.add(await pc.EPOCH_LENGTH())

            return {amount, scheduledFor, deadline}
        }
    },
}


const maxAllowance = BigNumber.from(2).pow(256).sub(1)

export const allowanceRefillThreshold = maxAllowance.div(2)


export const actions = {
    deposit: (amount, web3) =>
        web3.contracts.pool.deposit(
            web3.account,
            parseEther(amount),
            web3.account,
        ),

    grantInfiniteAllowanceToPool: web3 =>
        web3.contracts.token.approve(
            web3.contracts.pool.address,
            maxAllowance,
        ),
    // See [1]

    withdraw: (amount, web3) =>
        web3.contracts.pool.withdraw(web3.account, parseEther(amount)),

    stake: (amount, web3) =>
        web3.contracts.pool.stake(parseEther(amount)),

    scheduleUnstake: (amount, web3) =>
        web3.contracts.pool.scheduleUnstake(parseEther(amount)),

    unstake: web3 =>
        web3.contracts.pool.unstake(),

    unstakeAndWithdraw: web3 =>
        web3.contracts.pool.unstakeAndWithdraw(web3.account),
}


/* eslint-disable max-len */

// [1] We are aware of the ERC-20 approve vulnerability (See
//     https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol#L37-L51),
//     but not doing anything about it here as it's not really a vulnerability
//     when we want to grant an infinite allowance.
