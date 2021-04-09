const
    {InjectedConnector} = require('@web3-react/injected-connector'),
    {WalletConnectConnector} = require('@web3-react/walletconnect-connector'),
    {DEVCHAIN_ID, DEVCHAIN_URL} = process.env


module.exports = {
    MetaMask: () =>
        new InjectedConnector({supportedChainIds: [Number(DEVCHAIN_ID)]}),

    WalletConnect: () =>
        new WalletConnectConnector({rpc: {[DEVCHAIN_ID]: DEVCHAIN_URL}}),
}
