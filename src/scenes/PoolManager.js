const
    {createElement, useState} = require('react'),
    {useWeb3, actions: {deposit, withdraw, stake}} = require('lib/web3'),
    {fmtApi3} = require('lib/util'),
    {Card} = require('lib/ui')


const PoolManager = () => {
    const
        web3 = useWeb3(),
        [depositAmount, setDepositAmount] = useState(''),
        [stakeAmount, setStakeAmount] = useState('')

    return <Card>
        <h2 children='Pool' />

        <ul>
            <li>Balance: {fmtApi3(web3.api3Balance)}</li>
            <li>Deposited: {fmtApi3(web3.depositAmount)}</li>
            <li>Staked: {fmtApi3(web3.stakeAmount)}</li>
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

            <button
                children='Withdraw'
                onClick={() => withdraw(depositAmount, web3)}
            />
        </p>

        <p>
            <input
                type='number'
                value={stakeAmount}
                placeholder='100'
                onChange={e => setStakeAmount(e.target.value)}
                style={{width: 50}}
            />

            <button
                children='Stake'
                onClick={() => stake(stakeAmount, web3)}
            />
        </p>
    </Card>
}


module.exports = PoolManager
