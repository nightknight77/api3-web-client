import React, {useState, useEffect, useRef} from 'react'
import {padStart} from 'lodash-es'
import {useWeb3, actions} from 'lib/web3'
import {fmtApi3, duration} from 'lib/util'
import {Button, Heading3} from 'lib/ui'
import s from './style.css'

const {unstake, unstakeAndWithdraw} = actions


const Unstaking = () => {
    const
        web3 = useWeb3(),

        scheduledForTs = web3.pendingUnstake.scheduledFor.toNumber(),
        deadlineTs = web3.pendingUnstake.deadline.toNumber(),
        nowTs = Date.now() / 1000,

        [status, setStatus] = useState(() => {
            if (scheduledForTs > nowTs) return 'scheduled'
            if (nowTs > deadlineTs) return 'overdue'
            return 'pending'
        }),

        [countdown, setCountdown] = useState(() =>
            Math.ceil({
                scheduled: scheduledForTs - nowTs,
                pending: deadlineTs - nowTs,
                overdue: 0,
            }[status]),
        ),

        countdownDuration = duration(countdown),

        scheduledForDuration =
            status === 'scheduled' ? countdownDuration : duration(0),

        deadlineDuration =
            status === 'pending' ? countdownDuration : duration(0),

        intervalId = useRef()

    useEffect(() => {
        if (status !== 'overdue')
            intervalId.current =
                setInterval(() => setCountdown(c => c - 1), 1000)
    }, [])

    useEffect(() => {
        if (countdown !== 0)
            return

        if (status === 'scheduled') {
            setStatus('pending')
            setCountdown(Math.ceil(deadlineTs - Date.now() / 1000))
        }

        if (status === 'pending') {
            setStatus('overdue')
            clearInterval(intervalId.current)
        }
    }, [countdown])


    return <div className={s.root}>
        <Heading3 children='Pending API3 tokens unstaking' />

        <table className={s.unstaking}><tbody>
            <tr className={s.amount}>
                <th>Amount</th>
                <td>{fmtApi3(web3.pendingUnstake.amount)}</td>
            </tr>

            <tr>
                <th>Cooldown</th>

                <td>
                    <table className={s.cooldown}><tbody>
                        <tr>
                            <td>{scheduledForDuration.days} : </td>
                            <td>
                                {padStart(scheduledForDuration.hrs, 2, '0')} :
                            </td>
                            <td>
                                {padStart(scheduledForDuration.mins, 2, '0')} :
                            </td>
                            <td>
                                {padStart(scheduledForDuration.secs, 2, '0')}
                            </td>
                        </tr>

                        <tr>
                            <th>D</th>
                            <th>HR</th>
                            <th>MIN</th>
                            <th>SEC</th>
                        </tr>
                    </tbody></table>
                </td>
            </tr>
        </tbody></table>

        {['pending', 'overdue'].includes(status) &&
            <p className={s.deadlineWarning}>
                You have
                &nbsp;{deadlineDuration.days} days
                &nbsp;{deadlineDuration.hrs} hours
                &nbsp;{deadlineDuration.mins} minutes
                &nbsp;{deadlineDuration.secs} seconds
                remaining to unstake.
            </p>}

        <p className={s.footer}>
            <Button
                variant='link'
                children='Unstake & Withdraw'
                onClick={() => unstakeAndWithdraw(web3)}
                disabled={status !== 'pending'}
            />

            <Button
                children='Unstake'
                onClick={() => unstake(web3)}
                disabled={status !== 'pending'}
            />
        </p>
    </div>
}


export default Unstaking
