const
    {createElement, useEffect} = require('react'),
    ReactDOM = require('react-dom'),
    {Web3Provider, useWeb3, initWeb3} = require('./lib/web3'),
    {Landing} = require('./scenes')


const boot = () => {
    ReactDOM.render(<App />, document.getElementById('app'))

    if (process.env.NODE_ENV === 'development')
        module.hot.accept()
}


const App = () =>
    <Web3Provider children={
        <AppInitializer children={
            <Landing />} />} />


const AppInitializer = ({children}) => {
    const web3Ctx = useWeb3()

    useEffect(() => initWeb3(web3Ctx), [])

    return children
}


boot()
