const
    EventEmitter = require('events'),
    {Web3Provider} = require('@ethersproject/providers'),
    {promiseAllObj} = require('lib/util'),
    {connectorFactories, contractFactories, stateVars} = require('./config'),
    {mapValues, debounce} = require('lodash-es'),
    {assign} = Object


const
    initialState = {
        account: null,
        provider: null,
        contracts: null,
        blockNo: 0,
    },

    state = assign({}, initialState),

    resetState = () => assign(state, initialState)


const web3Events = new EventEmitter()


const initWeb3 = web3Ctx => {
    web3Events
        .on('activate', ({serviceName}) =>
            localStorage.setItem('lastWeb3Service', serviceName))

        .on('deactivate', () => {
            localStorage.removeItem('lastWeb3Service')
            state.provider.removeAllListeners()
            resetState()
            updateWeb3Numbers(state.blockNo, web3Ctx)
        })

    const lastWeb3Service = localStorage.getItem('lastWeb3Service')

    if (lastWeb3Service)
        activateWeb3(lastWeb3Service, web3Ctx)
}


const updateWeb3Numbers = async (fromBlock, web3Ctx) => {
    const setters =
        await promiseAllObj(
            mapValues(stateVars, getter =>
                getter({
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
        ),
    )
}


const activateWeb3 = async (serviceName, web3Ctx) => {
    const connector = connectorFactories[serviceName]()

    await web3Ctx.activate(connector, null, true)
    web3Events.emit('activate', {serviceName})

    const
        initialAccount = await connector.getAccount(),
        initialProvider = await connector.getProvider(),
        initialChainId = Number(await connector.getChainId())


    const handleAccountOrChainChange = async ({account, chainId, provider}) => {
        if (account) {
            state.account = account

            if (!provider)
                updateWeb3Numbers(0, web3Ctx)
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
                state.blockNo = blockNo

                if (handledFirstEvent)
                    updateWeb3Numbers(blockNo, web3Ctx)
                else {
                    updateWeb3Numbers(0, web3Ctx)
                    handledFirstEvent = true
                }
            })
        }
    }

    connector
        .on('Web3ReactUpdate', debounce(handleAccountOrChainChange, 50))
        .on('Web3ReactDeactivate', web3Ctx.deactivate)

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
