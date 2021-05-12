import React from 'react'
import {useRoute} from 'react-router5'
import {capitalize, noop} from 'lodash-es'
import {useWeb3, availableServices, activateWeb3} from 'lib/web3'
import {abbr} from 'lib/util'
import {useModal} from 'lib/modal'
import {Button} from 'lib/ui'
import logoImg from './logo.svg'
import dashboardIcon from './dashboard-icon.svg'
import dashboardActiveIcon from './dashboard-active-icon.svg'
import proposalsIcon from './proposals-icon.svg'
import proposalsActiveIcon from './proposals-active-icon.svg'
import s from './style.css'


const Layout = ({children}) => {
    const
        {route, router} = useRoute(),
        web3 = useWeb3(),
        modal = useModal()

    return <div className={s.root}>
        <header>
            <h1>
                <img src={logoImg} />
                &nbsp;
                API3
            </h1>

            {!web3.account
                ? <Button
                    children='Connect Wallet'
                    onClick={() => modal.open(WalletConnector, {
                        web3,
                        onActivate: modal.close,
                    })}
                />

                : <div
                    className={s.walletConnection}
                    onClick={() => modal.open(WalletDetails, {
                        web3,
                        onDeactivate: modal.close,
                    })}
                >
                    <div className={s.connectionDot} />
                    <div>
                        <div>{abbr(web3.account, 9, 4, '....')}</div>

                        <div
                            className={s.providerInfo}
                            children={
                                `Connected to ${web3.currentWalletServiceName}`}
                        />
                    </div>
                </div>}
        </header>

        <section>
            <aside>
                <img
                    src={route.name === 'staking'
                        ? dashboardActiveIcon
                        : dashboardIcon}

                    onClick={() => router.navigate('staking')}
                />

                <img
                    src={route.name === 'proposals'
                        ? proposalsActiveIcon
                        : proposalsIcon}

                    onClick={() => router.navigate('proposals')}
                />
            </aside>

            <main>
                <h1>
                    {capitalize(route.name)}

                    <div
                        className={s.headingMiddle}
                        children={capitalize(route.name)}
                    />

                    <div
                        className={s.headingBottom}
                        children={
                            route.name !== 'staking'
                                ? capitalize(route.name)
                                : web3.account
                                    ? abbr(web3.account, 9, 4, '....')
                                    : 'Welcome to the API3 DAO'}
                    />
                </h1>

                <div>{children}</div>
            </main>
        </section>
    </div>
}


const WalletConnector = ({web3, onActivate = noop}) =>
    availableServices.map(serviceName =>
        <Button
            key={serviceName}
            children={serviceName}
            onClick={async () => {
                await activateWeb3(serviceName, web3)
                onActivate()
            }}
            style={{
                color: serviceColors[serviceName],
                borderColor: serviceColors[serviceName],
            }}
        />,
    )

const serviceColors = {
    MetaMask: 'orange',
    WalletConnect: 'lightblue',
}


const WalletDetails = ({web3, onDeactivate = noop}) =>
    <div className={s.walletDetails}>
        <p children={web3.account} />

        <p children={`Connected to ${web3.currentWalletServiceName}`} />

        <Button
            children='Disconnect'
            onClick={() => {
                web3.deactivate()
                onDeactivate()
            }}
        />
    </div>


export default Layout
