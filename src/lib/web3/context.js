const
    {createElement, createContext, useContext, useState} = require('react'),
    {Web3Provider: Web3EthersProvider} = require('@ethersproject/providers'),
    {Web3ReactProvider, useWeb3React} = require('@web3-react/core'),
    {mapValues} = require('lodash-es'),
    {handleWeb3Deactivate} = require('./init'),
    {stateVars} = require('./config')


const initialWeb3AccountValue = {
    contracts: {},
    ...mapValues(stateVars, () => undefined),
}


const Web3AccountContext = createContext()


const Web3Provider = ({children}) => {
    const [web3AccountState, setWeb3AccountState] =
        useState(initialWeb3AccountValue)

    return <Web3ReactProvider
        getLibrary={provider => new Web3EthersProvider(provider)}
    >
        <Web3AccountContext.Provider
            value={{
                ...web3AccountState,

                update: patch =>
                    setWeb3AccountState(prevState => ({
                        ...prevState,

                        ...(typeof patch === 'function'
                            ? patch(prevState)
                            : patch
                        ),
                    })),
            }}
        >
            {children}
        </Web3AccountContext.Provider>
    </Web3ReactProvider>
}


const useWeb3 = () => {
    const
        web3React = useWeb3React(),
        web3Account = useContext(Web3AccountContext),
        web3 = {...web3React, ...web3Account}

    return {
        ...web3,

        deactivate: async () => {
            await web3React.deactivate()
            handleWeb3Deactivate(web3)
        },
    }
}


module.exports = {
    Web3Provider,
    useWeb3,
}
