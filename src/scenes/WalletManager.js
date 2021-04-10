const
    {createElement, Fragment} = require('react'),
    {availableServices, activateWeb3, useWeb3} = require('lib/web3'),
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


const WalletConnector = ({web3}) =>
    <>
        <h2 children='Connect your thing' />

        {availableServices.map(serviceName =>
            <button
                key={serviceName}
                children={serviceName}
                onClick={() => activateWeb3(serviceName, web3)}
            />,
        )}
    </>


const WalletInfo = ({web3}) =>
    <>
        <h2 children={web3.account} />

        <button
            children='Disconnect'
            onClick={web3.deactivate}
        />
    </>


module.exports = WalletManager
