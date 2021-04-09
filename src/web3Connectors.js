const
    {InjectedConnector} = require('@web3-react/injected-connector'),
    {WalletConnectConnector} = require('@web3-react/walletconnect-connector'),
    {keys} = Object,
    {DEVCHAIN_ID, DEVCHAIN_URL} = process.env


const connectorFactories = {
    MetaMask: () =>
        new InjectedConnector({supportedChainIds: [Number(DEVCHAIN_ID)]}),

    WalletConnect: () =>
        new WalletConnectConnector({rpc: {[DEVCHAIN_ID]: DEVCHAIN_URL}}),
}


const availableServices = keys(connectorFactories)


module.exports = {
    availableServices,
    connectorFactories,
}
