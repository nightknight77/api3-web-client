const
    {Web3Provider} = require('@ethersproject/providers'),
    {connectorFactories} = require('./connectors'),
    {reinitContracts} = require('./contracts')


const initWeb3 = async web3Ctx => {
    const lastWeb3Service = localStorage.getItem('lastWeb3Service')

    if (!lastWeb3Service)
        return

    const
        connector = connectorFactories[lastWeb3Service](),
        provider = new Web3Provider(await connector.getProvider())

    await web3Ctx.activate(connector, console.error)
    reinitContracts(provider)
}


module.exports = {
    initWeb3,
}
