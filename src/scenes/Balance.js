const
    {createElement} = require('react'),
    {BigNumber} = require('@ethersproject/bignumber'),
    {useWeb3} = require('lib/web3'),
    {fmtApi3} = require('lib/util')


const Balance = () => {
    const web3 = useWeb3()

    return [
        ['Total', web3.depositAmount],
        ['Withdrawable', web3.depositAmount],
    ]
        .map(([title, value]) =>
            <div
                key={title}
                style={{textAlign: 'center'}}
            >
                <h4
                    children={title.toUpperCase()}
                    style={{margin: 0, fontSize: 12, color: '#777'}}
                />
                <h3
                    children={fmtApi3(value || BigNumber.from(0))}
                    style={{margin: '8px 0 20px', fontSize: 24}}
                />
            </div>)
}


module.exports = Balance
