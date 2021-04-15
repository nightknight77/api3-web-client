const
    {createElement} = require('react'),
    {noop} = require('lodash-es'),
    s = require('./style.css').default


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


module.exports = Popup
