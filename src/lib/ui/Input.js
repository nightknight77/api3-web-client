const {createElement} = require('react')


const Input = ({type, style: extraStyles, size = 'md', ...props}) =>
    <input
        style={{
            padding: '10px 0',
            margin: 5,
            border: '0 solid #777',
            borderBottomWidth: 1,
            color: '#777',
            outline: 0,
            fontSize: {sm: '0.8em', md: '1em', lg: '1.5em'}[size],
            backgroundColor: 'transparent',
            width: 70,

            ...(type === 'number' && {
                fontWeight: 'bold',
                width: 30,
                textAlign: 'center',
            }),

            ...extraStyles,
        }}
        {...props}
    />


module.exports = Input
