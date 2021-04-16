import {createElement} from 'react'
import {useWeb3} from 'lib/web3'
import {Button} from 'lib/ui'

const {RINKEBY_FAUCET_URL} = process.env


const Faucet = () => {
    const web3 = useWeb3()

    return <div style={{
        textAlign: 'center',
    }}>
        <Button
            children='Get some tokens'
            onClick={() => window.open(RINKEBY_FAUCET_URL + '/' + web3.account)}
        />
    </div>
}


export default Faucet
