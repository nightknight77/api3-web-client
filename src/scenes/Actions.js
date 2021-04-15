const
    {createElement, useState} = require('react'),
    {capitalize} = require('lodash-es'),
    {useWeb3, actions: {deposit, withdraw, stake}} = require('lib/web3'),
    {useModal} = require('lib/modal'),
    {Input, Button} = require('lib/ui')


const Actions = () => {
    const
        web3 = useWeb3(),
        modal = useModal()

    return [
        ['deposit', '+', deposit],
        ['withdraw', '-', withdraw],
        ['stake', '+', stake],
    ].map((
        [opName, opSymbol, opAction],
    ) =>
        <Button
            key={opName}
            prefix={opSymbol}
            children={capitalize(opName)}
            onClick={() =>
                modal.open(TransferForm, {
                    intent: opName,
                    onSubmit: val => opAction(val, web3),
                })
            }
        />,
    )
}


const TransferForm = ({intent, onSubmit}) => {
    const [value, setValue] = useState('')

    return <div style={{textAlign: 'center'}}>
        <p>How many tokens would you like to {intent}?</p>

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


module.exports = Actions
