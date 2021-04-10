const
    {createElement, Fragment, useCallback} = require('react'),
    {availableServices, initWeb3, useWeb3} = require('lib/web3'),
    {Card} = require('lib/ui')


const WalletManager = () => {
    const web3 = useWeb3()

    return <Card>
        {web3.active
            ? <WalletInfo web3={web3} />
            : <WalletConnector web3={web3} />
        }
    </Card>
}


const WalletConnector = ({web3}) => {
    const activate = useCallback(async providerName => {
        localStorage.setItem('lastWeb3Service', providerName)
        await initWeb3(web3)
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


const WalletInfo = ({web3}) => {
    const deactivate = useCallback(async () => {
        await web3.deactivate()
        localStorage.removeItem('lastWeb3Service')
    })

    return <>
        <h2 children={web3.account} />

        <button
            children='Disconnect'
            onClick={deactivate}
        />
    </>
}


module.exports = WalletManager
