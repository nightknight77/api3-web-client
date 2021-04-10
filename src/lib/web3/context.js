const
    React = require('react'),
    {Web3Provider: Web3EthersProvider} = require('@ethersproject/providers'),
    {Web3ReactProvider, useWeb3React} = require('@web3-react/core')


const Web3Provider = ({children}) => {
    return <Web3ReactProvider
        getLibrary={provider => new Web3EthersProvider(provider)}
    >
        {children}
    </Web3ReactProvider>
}


const useWeb3 = () => {
    return useWeb3React()
}


module.exports = {
    Web3Provider,
    useWeb3,
}
