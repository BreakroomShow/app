import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import { config } from '../config'
import { useCluster } from '../containers/ConnectProvider'
import { Wallet } from './Wallet'

function ConnectedApp() {
    const wallet = useWallet()

    return (
        <p>
            <Wallet>{wallet.publicKey}</Wallet> <button onClick={() => wallet.disconnect()}>disconnect</button>
        </p>
    )
}

function DisconnectedApp() {
    return (
        <div>
            <WalletMultiButton />
        </div>
    )
}

export function ConnectionStatus() {
    const wallet = useWallet()

    const [cluster, setCluster] = useCluster()

    const content = (() => {
        if (wallet.connected) return <ConnectedApp />
        if (wallet.connecting) return null
        return <DisconnectedApp />
    })()

    return (
        <div>
            <div style={{ padding: '5px 0' }}>
                <select value={cluster} onChange={(e) => setCluster(e.target.value as config.Cluster)}>
                    {config.clusters.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>
            {content}
        </div>
    )
}
