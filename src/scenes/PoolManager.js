const
    React = require('react'),
    {useWeb3} = require('lib/web3'),
    {Card} = require('lib/ui')


const PoolManager = () => {
    const web3 = useWeb3()

    return <Card>
        <h2 children='Pool' />

        <ul>
            <li>Deposited: {web3.depositAmount}</li>
            <li>Staked: {web3.stakeAmount}</li>
        </ul>
    </Card>
}


module.exports = PoolManager
