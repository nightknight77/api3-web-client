import {createElement} from 'react'
import s from './style.css'


const Button = ({
    prefix,
    children,
    className = '',
    ...props
}) =>
    <button
        className={s.button + ' ' + className}
        {...props}
    >
        {prefix && <strong className={s.prefix} children={prefix} />}
        {children}
    </button>


export default Button
