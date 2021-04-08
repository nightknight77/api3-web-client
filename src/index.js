const
    React = require('react'),
    ReactDOM = require('react-dom'),
    {Web3Provider} = require('@ethersproject/providers'),
    {Web3ReactProvider} = require('@web3-react/core'),
    WalletManager = require('./WalletManager')


const boot = () => {
    ReactDOM.render(<App />, document.getElementById('app'))

    if (process.env.NODE_ENV === 'development')
        module.hot.accept()
}

const App = () =>
    <Web3ReactProvider getLibrary={provider => new Web3Provider(provider)}>
        <WalletManager />
    </Web3ReactProvider>


boot()
