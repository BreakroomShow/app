import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PublicKey } from '@solana/web3.js'

function Wallet({ children }: { children: PublicKey | null }) {
    const value = String(children)

    if (!value) {
        return <span>not connected</span>
    }

    return <span>{`${value.slice(0, 4)}...${value.slice(value.length - 4, value.length)}`}</span>
}

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
    if (wallet.connected) return <ConnectedApp />
    if (wallet.connecting) return null
    return <DisconnectedApp />
}
