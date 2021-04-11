const
    {createElement, Fragment} = require('react'),

    {Card} = require('lib/ui'),

    components = [
        require('./WalletManager'),
        require('./State'),
        require('./Actions'),
    ],

    logoImg = require('./logo.svg').default


const Landing = () => <>
    <h1 style={{textAlign: 'center'}}>
        <img src={logoImg} />
    </h1>

    <div
        style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
        }}
        children={components.map(c =>
            <Card
                key={c.name}
                style={{
                    flex: '0 0 250px',
                    height: 200,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                children={<div children={createElement(c)} />}
            />
        )}
    />
</>


module.exports = Landing
