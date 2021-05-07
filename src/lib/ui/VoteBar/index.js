import React from 'react'
import positiveIcon from './positive.png'
import negativeIcon from './negative.png'
import s from './style.css'


const VoteBar = ({for_, against, active = true}) => <>
    <div className={s.barWithIcons}>
        <img src={positiveIcon} />

        <div className={s.bar}>
            <div
                className={
                    s.for
                    + ' '
                    + ((!active && for_ < against) ? s.grayout : '')
                }
                style={{width: for_ + '%'}}
            />
            <div
                className={
                    s.against
                    + ' '
                    + ((!active && against < for_) ? s.grayout : '')
                }
                style={{width: against + '%'}}
            />
        </div>

        <img src={negativeIcon} />
    </div>

    <div className={s.legends}>
        <div className={s.forText} children={for_ + '%'} />
        <div className={s.againstText} children={against + '%'} />
    </div>
</>


export default VoteBar
