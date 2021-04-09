const
    {Web3Provider} = require('@ethersproject/providers'),
    {connectorFactories} = require('./web3Connectors'),
    {reinitContracts} = require('./contracts')


const init = ({web3React}) => {
    initWeb3(web3React)
}


const initWeb3 = async web3React => {
    const lastWeb3Service = localStorage.getItem('lastWeb3Service')

    if (!lastWeb3Service)
        return

    const
        connector = connectorFactories[lastWeb3Service](),
        provider = new Web3Provider(await connector.getProvider())

    await web3React.activate(connector, console.error)
    reinitContracts(provider)
}


module.exports = {
    init,
    initWeb3,
}
