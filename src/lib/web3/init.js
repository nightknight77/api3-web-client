import {Web3Provider} from '@ethersproject/providers'
import {promiseAllObj} from 'lib/util'
import {connectorFactories, contractFactories, stateVars} from './config'
import {mapValues, debounce} from 'lodash-es'

const {assign} = Object


const
    initialState = {
        account: null,
        provider: null,
        contracts: null,
        blockNo: 0,
    },

    state = assign({}, initialState),

    resetState = () => assign(state, initialState)


const handleWeb3Activate = serviceName =>
    localStorage.setItem('lastWeb3Service', serviceName)

export const handleWeb3Deactivate = web3Ctx => {
    localStorage.removeItem('lastWeb3Service')
    state.provider.removeAllListeners()
    resetState()
    updateWeb3Numbers(state.blockNo, web3Ctx)
}


export const initWeb3 = web3Ctx => {
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


export const activateWeb3 = async (serviceName, web3Ctx) => {
    const con = connectorFactories[serviceName]()

    await web3Ctx.activate(con, null, true)

    const [account, provider, chainId] = await Promise.all([
        con.getAccount(),
        con.getProvider(),
        con.getChainId(),
    ])

    handleAccountOrChainChange(web3Ctx, {account, provider, chainId})

    con
        .on('Web3ReactUpdate', debounce(e =>
            handleAccountOrChainChange(web3Ctx, e), 50))

        .on('Web3ReactDeactivate', web3Ctx.deactivate)

    handleWeb3Activate(serviceName)
}


const handleAccountOrChainChange = async (
    web3Ctx,
    {account, chainId, provider},
) => {
    web3Ctx.update(mapValues(stateVars, () => undefined))

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
