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
        provider = new Web3Provider(await connector.getProvider()),
        account = await connector.getAccount()

    await web3Ctx.activate(connector, console.error)

    const
        {pool: pc} = reinitContracts(provider),
        stakeAmount = await pc.balanceOf(account),
        depositEvents = await pc.queryFilter(pc.filters.Deposited(account)),
        depositAmount =
            depositEvents.reduce((sum, e) => e.args.amount.add(sum), 0)

    const patch = {
        depositAmount: depositAmount.toString(),
        stakeAmount: stakeAmount.toString(),
    }

    web3Ctx.update(patch)
}


module.exports = {
    initWeb3,
}
