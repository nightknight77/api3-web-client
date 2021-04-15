const
    {createElement, Fragment, useState} = require('react'),
    {capitalize} = require('lodash-es'),
    {useWeb3, actions: {deposit, withdraw, stake}} = require('lib/web3'),
    {useModal} = require('lib/modal'),
    {Card, Input, Button} = require('lib/ui'),
    {fmtApi3} = require('lib/util'),
    logoImg = require('./logo.svg').default


const sections = (web3, modal) => [
    {
        title: 'Wallet',
        component: require('./WalletManager'),
        cta1: web3.active && {
            title: 'Disconnect',
            action: web3.deactivate,
        },
    },
    {
        title: 'Balance',
        component: require('./Balance'),
        cta1: {
            title: 'Deposit',
            action: () => modal.open(TransferForm, {
                intent: 'deposit',
                onSubmit: val => deposit(val, web3).then(modal.close),
                children: `(Undeposited: ${fmtApi3(web3.api3Balance)})`,
            }),
        },
        cta2: {
            title: 'Withdraw',
            action: () => modal.open(TransferForm, {
                intent: 'withdraw',
                onSubmit: val => withdraw(val, web3).then(modal.close),
            }),
        },
    },
    {
        title: 'Staking',
        component: require('./Staking'),
        cta1: {
            title: 'Stake',
            action: () => modal.open(TransferForm, {
                intent: 'stake',
                onSubmit: val => stake(val, web3).then(modal.close),
            }),
        },
    },
    web3.chainId === 4 && {
        title: 'Faucet',
        component: require('./Faucet'),
    },
]
    .filter(Boolean)


const Landing = () => {
    const
        web3 = useWeb3(),
        modal = useModal(),
        sections_ = sections(web3, modal)

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
            children={sections_.map(({title, component, cta1, cta2}) =>
                <Card
                    key={component.name}
                    title={title}
                    cta1={cta1}
                    cta2={cta2}
                    style={{
                        flex: '0 0 250px',
                        height: 200,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    children={<div children={createElement(component)} />}
                />,
            )}
        />
    </>
}


const TransferForm = ({intent, children, onSubmit}) => {
    const [value, setValue] = useState('')

    return <div style={{textAlign: 'center'}}>
        <p>How many tokens would you like to {intent}?</p>

        {children && <p children={children} />}

        <p>
            <Input
                type='number'
                value={value}
                placeholder='00'
                size='lg'
                onChange={e => setValue(e.target.value)}
            />
        </p>

        <p>
            <Button
                children={capitalize(intent)}
                onClick={() => onSubmit(value)}
            />
        </p>
    </div>
}


module.exports = Landing
