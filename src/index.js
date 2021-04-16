import React, {useEffect} from 'react'
import ReactDOM from 'react-dom'
import {Web3Provider, useWeb3, initWeb3} from './lib/web3'
import {ModalProvider} from './lib/modal'
import {Landing} from './scenes'
import './global.css'


const boot = () => {
    ReactDOM.render(<App />, document.getElementById('app'))

    if (process.env.NODE_ENV === 'development')
        module.hot.accept()
}


const App = () =>
    <Web3Provider children={
        <ModalProvider children={
            <AppInitializer children={
                <Landing />} />} />} />


const AppInitializer = ({children}) => {
    const web3Ctx = useWeb3()

    useEffect(() => initWeb3(web3Ctx), [])

    return children
}


boot()
