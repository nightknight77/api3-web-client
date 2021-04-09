const web3ConnectorFactories = require('./web3Connectors')


const init = ({web3React}) => {
    initWeb3(web3React)
}


const initWeb3 = async web3React => {
    const lastWeb3Service = localStorage.getItem('lastWeb3Service')

    if (!lastWeb3Service)
        return

    const connector = web3ConnectorFactories[lastWeb3Service]()

    await web3React.activate(connector, console.error)
}


module.exports = init
