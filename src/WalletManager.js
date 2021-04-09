const
    React = require('react'),
    {useCallback} = React,
    {useWeb3React} = require('@web3-react/core'),
    {initWeb3} = require('./init'),
    {availableServices} = require('./web3Connectors')


const WalletManager = () => {
    const w3 = useWeb3React()

    return w3.active
        ? <WalletInfo w3={w3} />
        : <WalletConnector w3={w3} />
}


const WalletConnector = ({w3}) => {
    const activate = useCallback(async providerName => {
        localStorage.setItem('lastWeb3Service', providerName)
        await initWeb3(w3)
    })

    return <>
        <h2 children='Connect your thing' />

        {availableServices.map(providerName =>
            <button
                key={providerName}
                children={providerName}
                onClick={() => activate(providerName)}
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
