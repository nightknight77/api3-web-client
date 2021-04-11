const
    EventEmitter = require('events'),
    {Web3Provider} = require('@ethersproject/providers'),
    {promiseAllObj} = require('lib/util'),
    {connectorFactories, contractFactories, stateVars} = require('./config'),
    {mapValues, debounce} = require('lodash-es')


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
        initialProvider = await connector.getProvider(),
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
            )
        )
    }

    connector.on('Web3ReactUpdate', debounce(async ({account, chainId, provider}) => {
        web3Ctx.update(mapValues(stateVars, conf => conf.initial))

        if (account) {
            state.account = account

            if (!provider)
                updateWeb3Numbers(0)
        }

        if (provider) {
            const
                ethersProvider = new Web3Provider(provider),
                signer = await ethersProvider.getSigner()

            let handledFirstEvent = false

            state.provider = ethersProvider
            state.contracts =
                mapValues(
                    contractFactories, cFactory =>
                        cFactory(Number(chainId), signer))

            web3Ctx.update({contracts: state.contracts})

            ethersProvider.on('block', blockNo => {
                if (handledFirstEvent)
                    updateWeb3Numbers(blockNo)
                else {
                    updateWeb3Numbers(0)
                    handledFirstEvent = true
                }
            })
        }
    }, 50))

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
