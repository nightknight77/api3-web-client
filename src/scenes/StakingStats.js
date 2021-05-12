import React from 'react'
import {BigNumber} from 'ethers'
import {useWeb3} from 'lib/web3'
import {fmtApi3} from 'lib/util'


const StakingStats = () => {
    const web3 = useWeb3()

    return [
        ['Staked', web3.stakeAmount],
        ['Unstaked', web3.depositAmount],
    ]
        .map(([title, value]) =>
            <div
                key={title}
                style={{textAlign: 'center'}}
            >
                <h4
                    children={title.toUpperCase()}
                    style={{margin: 0, fontSize: 12, color: '#777'}}
                />
                <h3
                    children={fmtApi3(value)}
                    style={{margin: '8px 0 20px', fontSize: 24}}
                />
            </div>)
}


export default StakingStats
