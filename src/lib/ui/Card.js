const {createElement} = require('react')


const Card = ({children}) =>
    <div
        children={children}
        style={{
            border: '1px solid black',
            margin: 20,
            padding: 20,
        }}
    />


module.exports = Card
