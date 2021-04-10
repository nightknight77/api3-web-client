const
    {Contract} = require('@ethersproject/contracts'),
    {BigNumber} = require('@ethersproject/bignumber'),
    {InjectedConnector} = require('@web3-react/injected-connector'),
    {WalletConnectConnector} = require('@web3-react/walletconnect-connector'),
    poolABI = require('./contracts/pool-abi'),
    tokenABI = require('./contracts/token-abi'),
    {DEVCHAIN_ID, DEVCHAIN_URL,
        POOL_CONTRACT_ADDR, TOKEN_CONTRACT_ADDR} = process.env,
    {keys} = Object


const connectorFactories = {
    MetaMask: () =>
        new InjectedConnector({supportedChainIds: [Number(DEVCHAIN_ID)]}),

    WalletConnect: () =>
        new WalletConnectConnector({rpc: {[DEVCHAIN_ID]: DEVCHAIN_URL}}),
}


const contractFactories = {
    pool: provider => new Contract(POOL_CONTRACT_ADDR, poolABI, provider),
    token: provider => new Contract(TOKEN_CONTRACT_ADDR, tokenABI, provider),
}


const stateVars = {
    stakeAmount: {
        initial: BigNumber.from(0),

        updater: ({contracts, account}) => contracts.pool.balanceOf(account),
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
                    )

            return prevAmount => prevAmount.add(newDepositAmount)
        },
    },
}


module.exports = {
    connectorFactories,
    availableServices: keys(connectorFactories),
    contractFactories,
    stateVars,
}
