import { config } from '../config'
import { useWallet } from '../containers/ConnectProvider'
import { ConnectButton } from './ConnectButton'
import { Wallet } from './Wallet'

export function ConnectionStatus() {
    const { status, publicKey, cluster, setCluster } = useWallet()

    return (
        <div>
            <div style={{ padding: '5px 0' }}>
                <select value={cluster} onChange={(e) => setCluster(e.target.value as typeof cluster)}>
                    {config.clusters.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>
            {status === 'connected' ? <Wallet>{publicKey}</Wallet> : null} <ConnectButton />
        </div>
    )
}
