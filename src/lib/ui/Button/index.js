const
    {createElement} = require('react'),
    s = require('./style.css').default


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


module.exports = Button
