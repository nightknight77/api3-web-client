const
    {Web3Provider} = require('@ethersproject/providers'),
    {promiseAllObj} = require('lib/util'),
    {connectorFactories, contractFactories, stateVars} = require('./config'),
    {initialWeb3AccountValue} = require('./context'),
    {mapValues} = require('lodash-es')


const state = {
    account: null,
    provider: null,
    contracts: null,
}


const initWeb3 = async web3Ctx => {
    const lastWeb3Service = localStorage.getItem('lastWeb3Service')

    if (!lastWeb3Service)
        return

    const
        connector = connectorFactories[lastWeb3Service](),
        initialAccount = await connector.getAccount(),
        initialProvider = new Web3Provider(await connector.getProvider())

    await web3Ctx.activate(connector, console.error)

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

    connector.on('Web3ReactUpdate', ({account, provider}) => {
        web3Ctx.update(initialWeb3AccountValue)

        if (account) {
            state.account = account

            if (!provider)
                updateWeb3Numbers(0)
        }

        if (provider) {
            let handledFirstEvent = false

            state.provider = provider
            state.contracts =
                mapValues(contractFactories, cFactory => cFactory(provider))

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
    })
}


module.exports = {
    initWeb3,
}
