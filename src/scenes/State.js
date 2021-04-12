const
    {createElement} = require('react'),
    {useWeb3} = require('lib/web3'),
    {fmtApi3} = require('lib/util')


const State = () => {
    const web3 = useWeb3()

    return <table
        style={{
            borderSpacing: '5px 15px',
        }}
    >
        <tbody children={[
            ['Balance', web3.api3Balance],
            ['Deposited', web3.depositAmount],
            ['Staked', web3.stakeAmount],
        ]
            .map(([title, value]) =>
                <tr key={title}>
                    <th
                        style={{textAlign: 'right', fontWeight: 'normal'}}
                        children={title + ':'}
                    />

                    <td
                        style={{fontWeight: 'bold', fontSize: 24}}
                        children={fmtApi3(value)}
                    />
                </tr>,
            )
        } />
    </table>
}


module.exports = State
