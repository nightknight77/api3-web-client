import React, {createContext, useContext, useState} from 'react'
import {Web3Provider as Web3EthersProvider} from '@ethersproject/providers'
import {Web3ReactProvider, useWeb3React} from '@web3-react/core'
import {mapValues} from 'lodash-es'
import {handleWeb3Deactivate} from './init'
import {stateVars} from './config'


const initialWeb3AccountValue = {
    contracts: {},
    ...mapValues(stateVars, () => undefined),
}


const Web3AccountContext = createContext()


export const Web3Provider = ({children}) => {
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


export const useWeb3 = () => {
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
