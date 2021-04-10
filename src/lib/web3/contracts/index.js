const
    {Contract} = require('@ethersproject/contracts'),
    poolABI = require('./pool-abi'),
    {entries} = Object,
    {POOL_CONTRACT_ADDR} = process.env


const contractFactories = {
    pool: provider => new Contract(POOL_CONTRACT_ADDR, poolABI, provider),
}


const contracts = {
    /* [contractName]: contractInstance */
}


const reinitContracts = ethersProvider => {
    entries(contractFactories)
        .forEach(([cId, cFactory]) => {
            contracts[cId] =
                contracts[cId]
                    ? contracts[cId].connect(ethersProvider)
                    : cFactory(ethersProvider)
        })

    return contracts
}


module.exports = {
    contracts,
    reinitContracts,
}
