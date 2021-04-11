const {createElement} = require('react')


const Input = ({type, style: extraStyles, ...props}) =>
    <input
        style={{
            padding: 10,
            margin: 5,
            border: '1px solid #777',
            color: '#777',
            backgroundColor: 'transparent',
            width: 80,

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
