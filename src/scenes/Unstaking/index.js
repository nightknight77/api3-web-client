import React, {useState, useEffect, useRef} from 'react'
import {useWeb3, actions} from 'lib/web3'
import {fmtApi3, duration} from 'lib/util'
import {Button, Heading3} from 'lib/ui'
import s from './style.css'

const {unstake, unstakeAndWithdraw} = actions


const Unstaking = () => {
    const
        web3 = useWeb3(),

        [cooldown, setCooldown] = useState(() => {
            const
                scheduledForTs = web3.pendingUnstake.scheduledFor.toNumber(),
                nowTs = Date.now() / 1000

            return scheduledForTs < nowTs
                ? 0
                : Math.ceil(scheduledForTs - nowTs)
        }),

        cooldownDuration = duration(cooldown),

        intervalId = useRef()

    useEffect(() => {
        if (cooldown === 0)
            return

        intervalId.current =
            setInterval(() => {
                if (cooldown === 0)
                    clearInterval(intervalId.current)

                setCooldown(cooldown => cooldown - 1)
            }, 1000)
    }, [])

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
                    <table className={s.cooldown}>
                        <tbody>
                            <tr>
                                <td>{cooldownDuration.days} : </td>
                                <td>{cooldownDuration.hrs} : </td>
                                <td>{cooldownDuration.mins} : </td>
                                <td>{cooldownDuration.secs}</td>
                            </tr>

                            <tr>
                                <th>D</th>
                                <th>HR</th>
                                <th>MIN</th>
                                <th>SEC</th>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody></table>

        <p className={s.footer}>
            <Button
                variant='link'
                children='Unstake & Withdraw'
                onClick={unstakeAndWithdraw}
                disabled
            />

            <Button
                children='Unstake'
                onClick={unstake}
                disabled
            />
        </p>
    </div>
}


export default Unstaking
