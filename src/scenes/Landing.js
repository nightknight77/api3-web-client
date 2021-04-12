const
    {createElement, Fragment} = require('react'),

    {useWeb3} = require('lib/web3'),

    {Card} = require('lib/ui'),

    components = [
        require('./WalletManager'),
        require('./State'),
        require('./Actions'),
    ],

    Faucet = require('./Faucet'),

    logoImg = require('./logo.svg').default


const Landing = () => {
    const
        web3 = useWeb3(),

        finalComponents = [
            ...components,
            web3.chainId === 4 && Faucet,
        ]
            .filter(Boolean)

    return <>
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
            children={finalComponents.map(c =>
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
                />,
            )}
        />
    </>
}


module.exports = Landing
