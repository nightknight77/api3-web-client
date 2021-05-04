import React, {createElement, useState} from 'react'
import {capitalize} from 'lodash-es'
import {useWeb3, actions, allowanceRefillThreshold} from 'lib/web3'
import {useModal} from 'lib/modal'
import {Card, Input, Button} from 'lib/ui'
import {fmtApi3} from 'lib/util'
import WalletManager from './WalletManager'
import Balance from './Balance'
import Staking from './Staking'
import Faucet from './Faucet'
import logoImg from './logo.svg'
// Import the DAOPool scene
import DaoPool from './DaoPool'

const {deposit, withdraw, stake, grantInfiniteAllowanceToPool} = actions


const sections = (web3, modal) => [
    {
        title: 'Wallet',
        component: WalletManager,
        cta1: web3.active && {
            title: 'Disconnect',
            action: web3.deactivate,
        },
    },
    {
        title: 'Balance',
        component: Balance,
        cta1: (
            web3.poolAllowance &&
                web3.poolAllowance.lt(allowanceRefillThreshold)
        ) ?
            {
                title: 'Approve',
                action: () => grantInfiniteAllowanceToPool(web3),
            } : {
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
        component: Staking,
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
        component: Faucet,
    },
]
    .filter(Boolean)


const Landing = () => {
    const
        web3 = useWeb3(),
        modal = useModal(),
        sections_ = sections(web3, modal)

    return (
        <>
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
                children={sections_.map(({title, component, cta1, cta2}) => (
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
                    />
                ))}
            />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
                children={<DaoPool />}
            />
        </>
    )
}

export default Landing


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
