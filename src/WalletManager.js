const
    React = require('react'),
    {useCallback} = React,
    {useWeb3React} = require('@web3-react/core'),
    connectorFactories = require('./web3Connectors'),
    {entries} = Object


const WalletManager = () => {
    const w3 = useWeb3React()

    return w3.active
        ? <WalletInfo w3={w3} />
        : <WalletConnector w3={w3} />
}


const WalletConnector = ({w3}) => {
    const activate = useCallback(async (connectorFactory, providerName) => {
        const connector = connectorFactory()
        await w3.activate(connector, console.error)
        localStorage.setItem('lastWeb3Service', providerName)
    })

    return <>
        <h2 children='Connect your thing' />

        {entries(connectorFactories).map(([providerName, connectorFactory]) =>
            <button
                key={providerName}
                children={providerName}
                onClick={() => activate(connectorFactory, providerName)}
            />,
        )}
    </>
}


const WalletInfo = ({w3}) => {
    const deactivate = useCallback(async () => {
        await w3.deactivate()
        localStorage.removeItem('lastWeb3Service')
    })

    return <>
        <h2 children={w3.account} />

        <button
            children='Disconnect'
            onClick={deactivate}
        />
    </>
}


module.exports = WalletManager
