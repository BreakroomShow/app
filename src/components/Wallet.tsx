import { PublicKey } from '@solana/web3.js'

interface WalletProps {
    size?: number
    children: PublicKey | string | null
}

export function Wallet({ children, size = 4 }: WalletProps) {
    if (!children) return <span>not connected</span>

    const value = String(children)

    return <span>{`${value.slice(0, size)}...${value.slice(value.length - size, value.length)}`}</span>
}
