const
    {Web3Provider} = require('@ethersproject/providers'),
    {promiseAllObj} = require('lib/util'),
    {connectorFactories, contractFactories, stateVars} = require('./config'),
    {mapValues} = require('lodash-es')


const initWeb3 = async web3Ctx => {
    const lastWeb3Service = localStorage.getItem('lastWeb3Service')

    if (!lastWeb3Service)
        return

    const
        connector = connectorFactories[lastWeb3Service](),
        provider = new Web3Provider(await connector.getProvider()),
        account = await connector.getAccount(),
        lastBlock = await provider.getBlock(),
        contracts = mapValues(contractFactories, cFactory => cFactory(provider))

    await web3Ctx.activate(connector, console.error)
    web3Ctx.update({contracts})

    const updateWeb3Numbers = async fromBlock => {
        const setters =
            await promiseAllObj(
                mapValues(stateVars, conf =>
                    conf.updater({contracts, provider, account, fromBlock})))

        web3Ctx.update(prevState =>
            mapValues(setters, (s, propName) =>
                typeof s === 'function'
                    ? s(prevState[propName])
                    : s,
            ))
    }

    provider.on('block', blockNo =>
        updateWeb3Numbers(blockNo === lastBlock.number ? 0 : blockNo))
}


module.exports = {
    initWeb3,
}
