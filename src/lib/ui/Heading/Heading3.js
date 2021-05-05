import React from 'react'
import s from './style.css'


const Heading3 = ({className = '', ...props}) =>
    <div
        className={s.heading3 + ' ' + className}
        {...props}
    />


export default Heading3
