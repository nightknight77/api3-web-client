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
        lastBlock = await provider.getBlock(),
        contracts = mapValues(contractFactories, cFactory => cFactory(provider))

    await web3Ctx.activate(connector, console.error)
    web3Ctx.update({contracts})

    const updateWeb3Numbers = async (account, fromBlock) => {
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

    connector.on('Web3ReactUpdate', ({account}) =>
        updateWeb3Numbers(account, 0))

    provider.on('block', async blockNo => {
        const account = await connector.getAccount()

        updateWeb3Numbers(
            account,
            blockNo === lastBlock.number ? 0 : blockNo,
        )
    })
}


module.exports = {
    initWeb3,
}
