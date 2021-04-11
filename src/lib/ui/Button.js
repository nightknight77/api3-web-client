const {createElement} = require('react')


const Button = ({prefix, children, style: extraStyles = {}, ...props}) =>
    <button
        style={{
            margin: 5,
            padding: 10,
            backgroundColor: 'transparent',
            color: '#777',
            border: '1px solid #777',
            cursor: 'pointer',

            ...extraStyles,
        }}
        {...props}
    >
        {prefix && <strong style={{marginRight: 5}} children={prefix} />}
        {children}
    </button>


module.exports = Button
