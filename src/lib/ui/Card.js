const {createElement} = require('react')


const Card = ({title, style: extraStyles, children}) =>
    <div style={{
        border: '1px solid #777',
        margin: 20,
        padding: 20,

        ...extraStyles,
    }}>
        {title && <h2 style={{marginTop: 0}} children={title}/>}
        {children}
    </div>


module.exports = Card
