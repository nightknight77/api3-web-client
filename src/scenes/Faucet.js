const
    {createElement} = require('react'),
    {useWeb3} = require('lib/web3'),
    {Button} = require('lib/ui'),
    {RINKEBY_FAUCET_URL} = process.env


const Faucet = () => {
    const web3 = useWeb3()

    return <div style={{
        textAlign: 'center',
    }}>
        <Button
            children='Get some tokens'
            onClick={() => window.open(RINKEBY_FAUCET_URL + '/' + web3.account)}
        />
    </div>
}


module.exports = Faucet
