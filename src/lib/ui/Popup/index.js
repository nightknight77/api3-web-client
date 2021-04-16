import {createElement} from 'react'
import {noop} from 'lodash-es'
import s from './style.css'


const Popup = ({
    title,
    children,
    className = '',
    onClose = noop,
    ...props
}) =>
    <div
        className={s.popup + ' ' + className}
        {...props}
    >
        <header>
            <span>{title}</span>
            <button children='X' onClick={onClose} />
        </header>

        {children}
    </div>


export default Popup
