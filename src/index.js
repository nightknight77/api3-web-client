const
    React = require('react'),
    {useEffect} = React,
    ReactDOM = require('react-dom'),
    {Web3Provider} = require('@ethersproject/providers'),
    {Web3ReactProvider, useWeb3React} = require('@web3-react/core'),
    init = require('./init'),
    WalletManager = require('./WalletManager')


const boot = () => {
    ReactDOM.render(<App />, document.getElementById('app'))

    if (process.env.NODE_ENV === 'development')
        module.hot.accept()
}

const App = () =>
    <Web3ReactProvider getLibrary={provider => new Web3Provider(provider)}>
        <AppInitializer>
            <WalletManager />
        </AppInitializer>
    </Web3ReactProvider>


const AppInitializer = ({children}) => {
    const web3React = useWeb3React()

    useEffect(() => init({web3React}), [])

    return children
}


boot()
