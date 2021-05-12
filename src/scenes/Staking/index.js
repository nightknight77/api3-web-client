import React, {useState} from 'react'
import {capitalize} from 'lodash-es'
import {useWeb3, actions, allowanceRefillThreshold} from 'lib/web3'
import {useModal} from 'lib/modal'
import {Alert, Card, Input, Button, Slider} from 'lib/ui'
import {fmtApi3, duration} from 'lib/util'
import Balance from '../Balance'
import StakingStats from '../StakingStats'
import Unstaking from '../Unstaking'
import StakingPool from '../StakingPool'
import s from './style.css'

const {deposit, withdraw, stake, unstake,
    scheduleUnstake, grantInfiniteAllowanceToPool} = actions


const Staking = () => {
    const
        web3 = useWeb3(),
        modal = useModal(),
        remainingUnstakeDuration =
            (web3.pendingUnstake && web3.pendingUnstake.status === 'pending')
                ? duration(
                    web3.pendingUnstake.deadline.toNumber() - Date.now() / 1000)

                : null

    return <div className={s.root}>
        {remainingUnstakeDuration &&
            <Alert
                title='Your tokens are ready to be unstaked.'
                description={[
                    `Unstake within ${remainingUnstakeDuration.days} days`,
                    `${remainingUnstakeDuration.hrs} hours.`,
                ].join(' ')}
                cta={{
                    title: 'Unstake',
                    onClick: () => unstake(web3),
                }}
            />}

        <section>
            <h2 className={s.heading} children='How This Works' />

            <Slider
                className={s.slider}

                slides={[
                    'lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum',
                    'consectetuer adipisicing elit consectetuer adipisicing elit conse',
                    'sed do eiusmod tempor sed do eiusmod tempor sed do eiusmod tempor',
                ]}
            />
        </section>

        <section>
            <h2 className={s.heading} children='Staking Pool' />

            <StakingPool />
        </section>

        <section className={s.balanceAndStaking}>
            <Card
                title='Balance'
                children={<Balance />}
                cta1={(
                    web3.poolAllowance &&
                        web3.poolAllowance.lt(allowanceRefillThreshold)
                ) ?
                    {
                        title: 'Approve',
                        action: () => grantInfiniteAllowanceToPool(web3),
                    } : {
                        title: 'Deposit',
                        action: () => modal.open(TransferForm, {
                            intent: 'deposit',
                            onSubmit: val =>
                                deposit(val, web3).then(modal.close),
                            children:
                                `(Undeposited: ${fmtApi3(web3.api3Balance)})`,
                        }),
                    }
                }
                cta2={{
                    title: 'Withdraw',
                    action: () => modal.open(TransferForm, {
                        intent: 'withdraw',
                        onSubmit: val => withdraw(val, web3).then(modal.close),
                    }),
                }}
            />

            <Card
                title='Staking'
                children={<StakingStats />}
                cta1={{
                    title: 'Stake',
                    action: () => modal.open(TransferForm, {
                        intent: 'stake',
                        onSubmit: val => stake(val, web3).then(modal.close),
                    }),
                }}
                cta2={{
                    title: 'Initiate Unstake',
                    action: () => modal.open(TransferForm, {
                        intent: 'unstake',
                        onSubmit: val =>
                            scheduleUnstake(val, web3).then(modal.close),
                    }),
                }}
                extension={web3.pendingUnstake && <Unstaking />}
            />
        </section>
    </div>
}

export default Staking


const TransferForm = ({intent, children, onSubmit}) => {
    const
        [value, setValue] = useState(''),
        [confirmation, setConfirmation] = useState(false)

    return confirmation
        ? <div style={{textAlign: 'center'}}>
            <p>Are you sure you want to {intent} {value} tokens?</p>

            <p>
                <Button
                    variant='link'
                    children='Cancel'
                    onClick={() => setConfirmation(false)}
                />
                <Button
                    children={capitalize(intent)}
                    onClick={() => onSubmit(value)}
                />
            </p>
        </div>

        : <div style={{textAlign: 'center'}}>
            <p>How many tokens would you like to {intent}?</p>

            {children && <p children={children} />}

            <p>
                <Input
                    type='number'
                    value={value}
                    placeholder='00'
                    size='lg'
                    onChange={e => setValue(e.target.value)}
                />
            </p>

            <p>
                <Button
                    children={capitalize(intent)}
                    onClick={() => setConfirmation(true)}
                />
            </p>
        </div>
}
