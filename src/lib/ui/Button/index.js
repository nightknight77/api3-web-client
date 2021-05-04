import React from 'react'
import s from './style.css'


const Button = ({
    prefix,
    children,
    variant = 'primary',
    className = '',
    ...props
}) =>
    <button
        className={s.button + ' ' + s['variant-' + variant] + ' ' + className}
        {...props}
    >
        {prefix && <strong className={s.prefix} children={prefix} />}
        {children}
    </button>


export default Button
