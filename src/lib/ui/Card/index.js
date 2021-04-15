const
    {createElement} = require('react'),
    s = require('./style.css').default


const Card = ({title, children, className = '', ...props}) =>
    <div
        className={s.card + ' ' + className}
        {...props}
    >
        {title && <h2 children={title}/>}
        {children}
    </div>


module.exports = Card
