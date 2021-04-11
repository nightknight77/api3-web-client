const
    {createElement, Fragment} = require('react'),
    {availableServices, activateWeb3, useWeb3} = require('lib/web3'),
    {Button} = require('lib/ui'),
    {abbr} = require('lib/util')


const WalletManager = () => {
    const web3 = useWeb3()

    return <div style={{textAlign: 'center'}}>
        {web3.active
            ? <WalletInfo web3={web3} />
            : <WalletConnector web3={web3} />}
    </div>
}


const WalletConnector = ({web3}) =>
    <>
        <h3
            style={{marginTop: 10, textAlign: 'center'}}
            children='Connect your thing'
        />

        {availableServices.map(serviceName =>
            <Button
                key={serviceName}
                children={serviceName}
                onClick={() => activateWeb3(serviceName, web3)}
                style={{
                    color: serviceColors[serviceName],
                    borderColor: serviceColors[serviceName],
                }}
            />,
        )}
    </>

const serviceColors = {
    MetaMask: 'orange',
    WalletConnect: 'lightblue',
}


const WalletInfo = ({web3}) => <>
    <h3
        style={{marginTop: 10, color: 'green'}}
        children={abbr(web3.account, 9, 4)}
    />

    <Button
        children='Disconnect'
        onClick={web3.deactivate}
    />
</>


module.exports = WalletManager
