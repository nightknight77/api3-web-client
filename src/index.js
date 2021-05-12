import React, {createElement, useEffect} from 'react'
import ReactDOM from 'react-dom'
import {RouterProvider, Route} from 'react-router5'
import {router, routesByName} from './routing'
import {Web3Provider, useWeb3, initWeb3} from './lib/web3'
import {ModalProvider} from './lib/modal'
import './global.css'
import '../node_modules/react-responsive-carousel/lib/styles/carousel.min.css'


const boot = () =>
    router.start(() => {
        ReactDOM.render(
            <App router={router} />,
            document.getElementById('app'),
        )

        if (process.env.NODE_ENV === 'development')
            module.hot.accept()
    })


const App = ({router}) =>
    <RouterProvider router={router} children={
        <Web3Provider children={
            <ModalProvider children={
                <AppInitializer children={
                    <Route children={({route}) =>
                        createElement(routesByName[route.name].component)
                    } />} />} />} /> } />


const AppInitializer = ({children}) => {
    const web3Ctx = useWeb3()

    useEffect(() => initWeb3(web3Ctx), [])

    return children
}


boot()
