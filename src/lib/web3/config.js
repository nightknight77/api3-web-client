const
    {Contract} = require('@ethersproject/contracts'),
    {BigNumber} = require('@ethersproject/bignumber'),
    {parseEther} = require('@ethersproject/units'),
    {InjectedConnector} = require('@web3-react/injected-connector'),
    {WalletConnectConnector} = require('@web3-react/walletconnect-connector'),
    {flatten} = require('lodash-es'),
    poolABI = require('./contracts/pool-abi'),
    tokenABI = require('./contracts/token-abi'),
    {MAINNET_URL, RINKEBY_URL, DEVCHAIN_URL, DEVCHAIN_ID} = process.env,
    {keys, values} = Object


const connectorFactories = {
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


const contractAddresses = {
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


const contractFactories = {
    pool: (chainId, signer) =>
        new Contract(contractAddresses[chainId].pool, poolABI, signer),

    token: (chainId, signer) =>
        new Contract(contractAddresses[chainId].token, tokenABI, signer),
}


const stateVars = {
    api3Balance: {
        initial: BigNumber.from(0),

        updater: ({contracts, account}) => contracts.token.balanceOf(account),
    },

    stakeAmount: {
        initial: BigNumber.from(0),

        updater: ({contracts, account}) => contracts.pool.userStake(account),
    },

    depositAmount: {
        initial: BigNumber.from(0),

        updater: async ({contracts, account, fromBlock}) => {
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

            return prevAmount => prevAmount.add(updateAmount)
        },
    },
}


const actions = {
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


module.exports = {
    connectorFactories,
    availableServices: keys(connectorFactories),
    contractAddresses,
    contractFactories,
    stateVars,
    actions,
}
