const
    {createElement, Fragment, useState} = require('react'),
    {useWeb3, actions: {deposit, withdraw, stake}} = require('lib/web3'),
    {Input, Button} = require('lib/ui')


const Actions = () => {
    const
        web3 = useWeb3(),
        [depositAmount, setDepositAmount] = useState(''),
        [stakeAmount, setStakeAmount] = useState('')

    return <>
        <p>
            <Input
                type='number'
                value={depositAmount}
                placeholder='100'
                onChange={e => setDepositAmount(e.target.value)}
            />

            <Button
                prefix='+'
                children='Deposit'
                onClick={() => deposit(depositAmount, web3)}
            />

            <Button
                prefix='-'
                children='Withdraw'
                onClick={() => withdraw(depositAmount, web3)}
            />
        </p>

        <p>
            <Input
                type='number'
                value={stakeAmount}
                placeholder='100'
                onChange={e => setStakeAmount(e.target.value)}
            />

            <Button
                prefix='+'
                children='Stake'
                onClick={() => stake(stakeAmount, web3)}
            />
        </p>
    </>
}


module.exports = Actions
