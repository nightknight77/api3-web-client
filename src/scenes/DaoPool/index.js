import React from 'react'
import {BigNumber} from 'ethers'
import s from './style.css'
import {useWeb3} from '../../lib/web3'
import {fmtApi3} from '../../lib/util'

const DaoPool = () => {
    const web3 = useWeb3()
    return (
        <div className={s.container}>
            <div className={s.header}>DAO Pool</div>
            <div className={s.wrapper}>
                <div className={s.rewardsContainer}>
                    <div className={s.annualRate}>
                        <div className={s.rate}>
                            {fmtApi3(web3.apy)}%
                        </div>
                        <div className={s.reward}>
                            Annual rewards
                            <br />
                            (APY)
                        </div>
                    </div>
                    <div className={s.annualReward}>
                        <div className={s.rate}>
                            {fmtApi3(web3.ait || BigNumber.from(0))}%
                        </div>
                        <div className={s.reward}>
                            Annual Inflation
                            <br />
                            Rate
                        </div>
                    </div>
                </div>
                <div className={s.rewardsContainer}>
                    <div className={s.stakeContainer}>
                        <div>TOTAL STAKED</div>
                        <div className={s.stakeAmount}>
                            {fmtApi3(web3.totalStake)}
                        </div>
                    </div>
                    <div className={s.stakeContainer + ' ' + s.target}>
                        <div>STAKING TARGET</div>
                        <div className={s.stakeAmount}>
                            {fmtApi3(web3.stakeTarget)}
                        </div>
                    </div>
                </div>
                <div>Chart</div>
            </div>
        </div>
    )
}

export default DaoPool
