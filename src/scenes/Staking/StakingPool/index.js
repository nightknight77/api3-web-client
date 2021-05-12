import React from 'react'
import {useWeb3} from 'lib/web3'
import {fmtApi3} from 'lib/util'
import {RadialChart} from 'lib/ui'
import s from './style.css'


const StakingPool = () => {
    const web3 = useWeb3()

    return <div className={s.root}>
        <table><tbody>
            <tr className={s.apy}>
                <td children={web3.apy + '%'} />
                <th children='Annual Rewards (APY)' />
            </tr>

            <tr className={s.inflation}>
                <td children={web3.annualInflationRate + '%'} />
                <th children='Annual Inflation Rate' />
            </tr>
        </tbody></table>

        <table><tbody>
            <tr className={s.totalStaked}>
                <td>
                    <figure>
                        <figcaption children='TOTAL STAKED' />
                        {fmtApi3(web3.totalStake, 1)}
                    </figure>
                </td>
            </tr>

            <tr className={s.stakingTarget}>
                <td>
                    <figure>
                        <figcaption children='STAKING TARGET' />
                        {fmtApi3(web3.stakeTarget, 1)}
                    </figure>
                </td>
            </tr>
        </tbody></table>

        <RadialChart completionPercent={100} />
    </div>
}

export default StakingPool
