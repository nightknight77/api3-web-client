import React from 'react'
import Button from '../Button'
import warningIcon from './warning-icon.svg'
import s from './style.css'


const Alert = ({title, description, cta}) =>
    <div className={s.root}>
        <img src={warningIcon} />

        <div>
            <h4 children={title} />
            <p children={description} />
        </div>

        {cta && <Button children={cta.title} onClick={cta.onClick} />}
    </div>


export default Alert
