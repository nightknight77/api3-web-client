import {Contract} from '@ethersproject/contracts'
import {BigNumber} from '@ethersproject/bignumber'
import {parseEther} from '@ethersproject/units'
import {InjectedConnector} from '@web3-react/injected-connector'
import {WalletConnectConnector} from '@web3-react/walletconnect-connector'
import {flatten} from 'lodash-es'
import poolABI from './contracts/pool-abi'
import tokenABI from './contracts/token-abi'

const
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


export const stateVars = {
    api3Balance: ({contracts, account}) =>
        account
            ? contracts.token.balanceOf(account)
            : BigNumber.from(0),

    stakeAmount: ({contracts, account}) =>
        account
            ? contracts.pool.userStake(account)
            : BigNumber.from(0),

    depositAmount: async ({contracts, account, fromBlock}) => {
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

        return (prevAmount = BigNumber.from(0)) => prevAmount.add(updateAmount)
    },
}


export const actions = {
    deposit: async (amount, web3) => {
        const
            weiAmount = parseEther(amount),

            approveResp =
                await web3.contracts.token.approve(
                    contractAddresses[web3.chainId].pool,
                    weiAmount,
                )

        approveResp.wait()

        await web3.contracts.pool.deposit(web3.account, weiAmount, web3.account)
    },

    withdraw: (amount, web3) =>
        web3.contracts.pool.withdraw(web3.account, parseEther(amount)),

    stake: (amount, web3) =>
        web3.contracts.pool.stake(parseEther(amount)),
}
