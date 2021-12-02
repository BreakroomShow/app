import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { ReactNode, createContext, useContext, useMemo, useState } from 'react'

import { config } from '../config'

const ClusterContext = createContext<null | ReturnType<typeof useClusterState>>(null)

const useClusterState = () => useState<config.Cluster>('devnet')

export function useCluster() {
    const ctx = useContext(ClusterContext)

    if (ctx == null) {
        throw new Error('ClusterContext must be used within ConnectProvider')
    }

    return ctx
}

export function ConnectProvider({ children }: { children: ReactNode }) {
    const clusterState = useClusterState()
    const [network] = clusterState

    const endpoint = useMemo(() => config.clusterUrl(network), [network])

    return (
        <ConnectionProvider endpoint={endpoint} config={{ commitment: config.preflightCommitment }}>
            <ClusterContext.Provider value={clusterState}>
                <WalletProvider wallets={config.wallets} autoConnect>
                    <WalletModalProvider>{children}</WalletModalProvider>
                </WalletProvider>
            </ClusterContext.Provider>
        </ConnectionProvider>
    )
}
