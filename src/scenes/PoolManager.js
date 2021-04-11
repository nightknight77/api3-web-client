const
    {createElement, useState} = require('react'),
    {useWeb3, contractAddresses} = require('lib/web3'),
    {fmtApi3} = require('lib/util'),
    {Card} = require('lib/ui')


const deposit = async (amount, web3) => {
    const approveResp =
        await web3.contracts.token.approve(
            contractAddresses[web3.chainId].pool,
            amount,
        )

    approveResp.wait()

    await web3.contracts.pool.deposit(web3.account, amount, web3.account)
}

const stake = (amount, web3) => web3.contracts.pool.stake(amount)


const PoolManager = () => {
    const
        web3 = useWeb3(),
        [depositAmount, setDepositAmount] = useState(''),
        [stakeAmount, setStakeAmount] = useState('')

    return <Card>
        <h2 children='Pool' />

        <ul>
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
