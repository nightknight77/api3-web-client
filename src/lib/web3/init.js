const
    {Web3Provider} = require('@ethersproject/providers'),
    {BigNumber} = require('@ethersproject/bignumber'),
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
        lastBlock = await provider.getBlock()

    const updateWeb3Numbers = async (fromBlock = 0) => {
        const
            [stakeAmount, depositEvents] = await Promise.all([
                pc.balanceOf(account),
                pc.queryFilter(pc.filters.Deposited(account), fromBlock),
            ]),

            depositAmount =
                depositEvents.reduce(
                    (sum, e) => e.args.amount.add(sum),
                    BigNumber.from(0),
                )

        web3Ctx.update(prevState => ({
            stakeAmount,
            depositAmount: prevState.depositAmount.add(depositAmount),
        }))
    }

    provider.on('block', async bNo => {
        if (bNo !== lastBlock.number)
            await updateWeb3Numbers(bNo)
    })

    await updateWeb3Numbers()
}


module.exports = {
    initWeb3,
}
