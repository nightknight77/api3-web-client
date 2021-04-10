const
    {createElement, useState} = require('react'),
    {useWeb3} = require('lib/web3'),
    {Card} = require('lib/ui'),
    {POOL_CONTRACT_ADDR} = process.env


const deposit = async (amount, web3) => {
    const approveResp =
        await web3.contracts.token.approve(POOL_CONTRACT_ADDR, amount)

    approveResp.wait()

    await web3.contracts.pool.deposit(web3.account, amount, web3.account)
}


const PoolManager = () => {
    const
        web3 = useWeb3(),
        [depositAmount, setDepositAmount] = useState('')

    return <Card>
        <h2 children='Pool' />

        <ul>
            <li>Deposited: {web3.depositAmount.toString()}</li>
            <li>Staked: {web3.stakeAmount.toString()}</li>
        </ul>

        <p>
            <input
                type='number'
                value={depositAmount}
                placeholder='100'
                onChange={e => setDepositAmount(e.target.value)}
                style={{width: 50}}
            />

            <button
                children='Deposit'
                onClick={() => deposit(depositAmount, web3)}
            />
        </p>
    </Card>
}


module.exports = PoolManager
