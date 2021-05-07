import React from 'react'
import {useWeb3} from 'lib/web3'
import {fmtApi3} from 'lib/util'
import s from './style.css'


const DAOPool = () => {
    const web3 = useWeb3()

    return <ul className={s.list}>
        <li>Total Stake: <strong>{fmtApi3(web3.totalStake, 1)}</strong></li>
        <li>Stake Target: <strong>{fmtApi3(web3.stakeTarget, 1)}</strong></li>
        <li>Target Met: <strong>{web3.targetMet}%</strong></li>
        <li>APY: <strong>{web3.apy}%</strong></li>
        <li>Annual Inflation rate: <strong>{web3.annualInflationRate}%</strong></li>
    </ul>
}


export default DAOPool
