const
    {Contract} = require('@ethersproject/contracts'),
    {BigNumber} = require('@ethersproject/bignumber'),
    {parseEther} = require('@ethersproject/units'),
    {InjectedConnector} = require('@web3-react/injected-connector'),
    {WalletConnectConnector} = require('@web3-react/walletconnect-connector'),
    poolABI = require('./contracts/pool-abi'),
    tokenABI = require('./contracts/token-abi'),
    {MAINNET_URL, RINKEBY_URL, DEVCHAIN_URL, DEVCHAIN_ID} = process.env,
    {keys} = Object


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
                depositEvents =
                    await contracts.pool.queryFilter(
                        contracts.pool.filters.Deposited(account),
                        fromBlock,
                    ),

                newDepositAmount =
                    depositEvents.reduce(
                        (sum, e) => e.args.amount.add(sum),
                        BigNumber.from(0),
                    ),

                withdrawEvents =
                    await contracts.pool.queryFilter(
                        contracts.pool.filters.Withdrawn(null, account),
                        fromBlock,
                    ),

                newWithdrawAmount =
                    withdrawEvents.reduce(
                        (sum, e) => e.args.amount.add(sum),
                        BigNumber.from(0),
                    ),

                stakeEvents =
                    await contracts.pool.queryFilter(
                        contracts.pool.filters.Staked(account),
                        fromBlock,
                    ),

                newStakeAmount =
                    stakeEvents.reduce(
                        (sum, e) => e.args.amount.add(sum),
                        BigNumber.from(0),
                    ),

                unstakeEvents =
                    await contracts.pool.queryFilter(
                        contracts.pool.filters.Unstaked(account),
                        fromBlock,
                    ),

                newUnstakeAmount =
                    unstakeEvents.reduce(
                        (sum, e) => e.args.amount.add(sum),
                        BigNumber.from(0),
                    )

            return prevAmount =>
                prevAmount
                    .add(newDepositAmount)
                    .add(newUnstakeAmount)
                    .sub(newWithdrawAmount)
                    .sub(newStakeAmount)
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
