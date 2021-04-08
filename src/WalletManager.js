const
    React = require('react'),
    {useWeb3React} = require('@web3-react/core'),
    {InjectedConnector} = require('@web3-react/injected-connector'),
    {WalletConnectConnector} = require('@web3-react/walletconnect-connector'),
    {entries} = Object,
    {DEVCHAIN_ID, DEVCHAIN_URL} = process.env


const connectors = {
    MetaMask: new InjectedConnector({
        supportedChainIds: [Number(DEVCHAIN_ID)],
    }),

    WalletConnect: new WalletConnectConnector({
        rpc: {[DEVCHAIN_ID]: DEVCHAIN_URL},
    }),
}


const WalletManager = () => {
    const w3 = useWeb3React()

    return w3.active
        ? <WalletInfo w3={w3} />
        : <WalletConnector w3={w3} />
}


const WalletConnector = ({w3}) => <>
    <h2 children='Connect your thing' />

    {entries(connectors).map(([providerName, connector]) =>
        <button
            key={providerName}
            children={providerName}
            onClick={() => w3.activate(connector, console.error)}
        />,
    )}
</>


const WalletInfo = ({w3}) => <>
    <h2 children={w3.account} />

    <button
        children='Disconnect'
        onClick={w3.deactivate}
    />
</>


module.exports = WalletManager
