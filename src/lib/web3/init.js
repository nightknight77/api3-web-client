const
    EventEmitter = require('events'),
    {Web3Provider} = require('@ethersproject/providers'),
    {promiseAllObj} = require('lib/util'),
    {connectorFactories, contractFactories, stateVars} = require('./config'),
    {initialWeb3AccountValue} = require('./context'),
    {mapValues} = require('lodash-es')


const web3Events = new EventEmitter()


web3Events.on('activate', ({serviceName}) =>
    localStorage.setItem('lastWeb3Service', serviceName))

web3Events.on('deactivate', () =>
    localStorage.removeItem('lastWeb3Service'))


const initWeb3 = web3Ctx => {
    const lastWeb3Service = localStorage.getItem('lastWeb3Service')

    if (lastWeb3Service)
        activateWeb3(lastWeb3Service, web3Ctx)
}


const state = {
    account: null,
    provider: null,
    contracts: null,
}


const activateWeb3 = async (serviceName, web3Ctx) => {
    const
        connector = connectorFactories[serviceName](),
        initialAccount = await connector.getAccount(),
        initialProvider = new Web3Provider(await connector.getProvider()),
        initialChainId = Number(await connector.getChainId())

    await web3Ctx.activate(connector, null, true)
    web3Events.emit('activate', {serviceName})

    const updateWeb3Numbers = async fromBlock => {
        const setters =
            await promiseAllObj(
                mapValues(stateVars, conf =>
                    conf.updater({
                        fromBlock,
                        account: state.account,
                        provider: state.provider,
                        contracts: state.contracts,
                    })))

        web3Ctx.update(prevState =>
            mapValues(setters, (s, propName) =>
                typeof s === 'function'
                    ? s(prevState[propName])
                    : s,
            ))
    }

    connector.on('Web3ReactUpdate', async ({account, chainId, provider}) => {
        web3Ctx.update(initialWeb3AccountValue)

        if (account) {
            state.account = account

            if (!provider)
                updateWeb3Numbers(0)
        }

        if (provider) {
            const signer = await provider.getSigner()
            let handledFirstEvent = false

            state.provider = provider
            state.contracts =
                mapValues(
                    contractFactories, cFactory => cFactory(chainId, signer))

            web3Ctx.update({contracts: state.contracts})

            provider.on('block', blockNo => {
                if (handledFirstEvent)
                    updateWeb3Numbers(blockNo)
                else {
                    updateWeb3Numbers(0)
                    handledFirstEvent = true
                }
            })
        }
    })

    connector.emit('Web3ReactUpdate', {
        account: initialAccount,
        provider: initialProvider,
        chainId: initialChainId,
    })
}


module.exports = {
    web3Events,
    initWeb3,
    activateWeb3,
}
