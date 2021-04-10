const
    React = require('react'),
    WalletManager = require('./WalletManager'),
    PoolManager = require('./PoolManager')


const Landing = () => <>
    <WalletManager />
    <PoolManager />
</>


module.exports = Landing
