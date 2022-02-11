import {
    MessageSignerWalletAdapterProps,
    SignerWalletAdapterProps,
    WalletAdapterProps,
    WalletError,
    WalletNotConnectedError,
    WalletNotReadyError,
} from '@solana/wallet-adapter-base'
import { Wallet, getPhantomWallet } from '@solana/wallet-adapter-wallets'
import * as solana from '@solana/web3.js'
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { authorize } from '../api'
import { config } from '../config'
import { useGetLatest } from '../hooks/useGetLatest'
import { useIsUnloading } from '../hooks/useIsUnloading'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { isIframe } from '../utils/isIframe'

type AuthState =
    | { status: 'idle'; token: null }
    | { status: 'connecting'; token: null }
    | { status: 'connected'; token: string }

const authIdle: AuthState = { status: 'idle', token: null }

interface WalletContextState extends WalletAdapterProps, SignerWalletAdapterProps, MessageSignerWalletAdapterProps {
    status: 'idle' | 'connecting' | 'connected' | 'disconnecting'
    auth: AuthState
    idle: boolean
    disconnecting: boolean

    wallet: Wallet
    adapter: ReturnType<Wallet['adapter']> | null
    cluster: solana.Cluster
    setCluster(cluster: WalletContextState['cluster']): void
    connection: solana.Connection
}

const WalletContext = createContext<WalletContextState | null>(null)

export function useWallet() {
    const ctx = useContext(WalletContext)

    if (ctx == null) {
        throw new Error('useWallet must be used within WalletProvider')
    }

    return ctx
}

class WalletNotSelectedError extends WalletError {
    name = 'WalletNotSelectedError'
}

const wallet = getPhantomWallet()

export function ConnectProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<WalletContextState['status']>('idle')
    const [adapter, setAdapter] = useState<ReturnType<typeof wallet['adapter']> | null>(null)
    const [ready, setReady] = useState(false)
    const [publicKey, setPublicKey] = useState<solana.PublicKey | null>(null)

    const [version, setVersion] = useLocalStorage(`tokens-version`, 1)
    const [tokens, setTokens] = useLocalStorage<{ [v in number]?: { [pKey in string]?: string } }>(`tokens`, {})
    const setToken = useGetLatest((key: typeof publicKey, token: string) => {
        setTokens({ [version]: { [String(publicKey)]: token } })
    })
    const token = tokens[version]?.[String(publicKey)] || null

    const [auth, setAuth] = useState<AuthState>(token ? { status: 'connected', token } : authIdle)

    const [autoConnect, setAutoConnect] = useLocalStorage('autoConnect', false)

    const [cluster, setCluster] = useState<WalletContextState['cluster']>('devnet')
    const endpoint = useMemo(() => config.clusterUrl(cluster), [cluster])
    const connection = useMemo(
        () => new solana.Connection(endpoint, { commitment: config.preflightCommitment }),
        [endpoint],
    )

    const isUnloading = useIsUnloading()

    useEffect(() => {
        if (isIframe) return

        const _adapter = wallet.adapter()

        if (_adapter) {
            setAdapter(_adapter)
            setReady(_adapter.ready)
            setPublicKey(_adapter.publicKey)

            if (_adapter.connected) {
                setStatus('connected')
            }
        } else {
            setAdapter(null)
            setReady(false)
            setPublicKey(null)
        }
    }, [])

    useEffect(() => {
        async function onAutoConnect() {
            if (isUnloading.current) return
            if (!autoConnect) return
            if (!adapter) return
            if (!ready) return

            if (status !== 'idle') return

            setStatus('connecting')
            try {
                await adapter.connect()
            } catch (AutoConnectError) {
                console.error({ AutoConnectError })
            }
        }

        onAutoConnect()
    }, [adapter, autoConnect, isUnloading, ready, status])

    const connect = useCallback(async () => {
        if (status === 'connecting' || status === 'connected' || status === 'disconnecting') return

        if (!adapter) throw new WalletNotSelectedError()
        if (!ready) throw new WalletNotReadyError()

        setStatus('connecting')

        try {
            await adapter.connect()

            if (adapter.connected) {
                setStatus('connected')
            }
        } catch (ConnectError) {
            console.error({ ConnectError })
            throw ConnectError
        }
    }, [adapter, ready, status])

    const disconnect = useCallback(async () => {
        if (!adapter) return
        if (status === 'disconnecting') return

        setStatus('disconnecting')
        setAutoConnect(false)
        setVersion((prev) => prev + 1)

        try {
            await adapter.disconnect()
        } catch (DisconnectError) {
            console.error({ DisconnectError })
            throw DisconnectError
        }
    }, [adapter, setAutoConnect, setVersion, status])

    const sendTransaction: WalletContextState['sendTransaction'] = useGetLatest((transaction, _connection, options) => {
        if (!adapter) throw new WalletNotSelectedError()
        if (status !== 'connected') throw new WalletNotConnectedError()

        return adapter.sendTransaction(transaction, _connection, options)
    })

    const signTransaction: WalletContextState['signTransaction'] = useGetLatest(async (transaction) => {
        if (!adapter || !('signTransaction' in adapter)) throw new WalletNotSelectedError()
        if (status !== 'connected') throw new WalletNotConnectedError()

        return adapter.signTransaction(transaction)
    })

    const signAllTransactions: WalletContextState['signAllTransactions'] = useGetLatest(async (transactions) => {
        if (!adapter || !('signAllTransactions' in adapter)) throw new WalletNotSelectedError()
        if (status !== 'connected') throw new WalletNotConnectedError()

        return adapter.signAllTransactions(transactions)
    })

    const signMessage: WalletContextState['signMessage'] = useGetLatest(async (message) => {
        if (!adapter || !('signMessage' in adapter)) throw new WalletNotSelectedError()
        if (status !== 'connected') throw new WalletNotConnectedError()

        return adapter.signMessage(message)
    })

    useEffect(() => {
        if (status !== 'connected') {
            setAuth((prev) => (prev.status === 'idle' ? prev : authIdle))
            return
        }

        if (token) {
            setAuth({ status: 'connected', token })
            return
        }

        setAuth({ status: 'connecting', token: null })

        authorize({ sign: signMessage, publicKey })
            .then((result) => {
                setToken(publicKey, result)
                setAutoConnect(true)
            })
            .catch(() => {
                setAutoConnect(false)
                setAuth({ status: 'idle', token: null })
                disconnect()
            })
    }, [disconnect, publicKey, setAutoConnect, setToken, signMessage, status, token])

    useEffect(() => {
        if (!adapter) return

        function onReady() {
            setReady(true)
        }

        const onConnect = () => {
            setReady(adapter.ready)
            setPublicKey(adapter.publicKey)

            if (adapter.connected) {
                setStatus('connected')
            }
        }

        const onDisconnect = () => {
            setStatus('idle')
        }

        const onError = () => {
            if (adapter.connected) {
                setStatus('connected')
            } else {
                setStatus('idle')
            }
        }

        adapter.on('ready', onReady)
        adapter.on('connect', onConnect)
        adapter.on('disconnect', onDisconnect)
        adapter.on('error', onError)

        return () => {
            adapter.off('ready', onReady)
            adapter.off('connect', onConnect)
            adapter.off('disconnect', onDisconnect)
            adapter.off('error', onError)
        }
    }, [adapter])

    const ctx: WalletContextState = useMemo(
        () => ({
            status,
            auth,
            wallet,
            adapter,
            publicKey,
            ready,
            cluster,
            setCluster,
            connection,
            idle: status === 'idle',
            connecting: status === 'connecting',
            connected: status === 'connected',
            disconnecting: status === 'disconnecting',
            connect,
            disconnect,
            sendTransaction,
            signTransaction,
            signAllTransactions,
            signMessage,
        }),
        [
            adapter,
            auth,
            cluster,
            connect,
            connection,
            disconnect,
            publicKey,
            ready,
            sendTransaction,
            signAllTransactions,
            signMessage,
            signTransaction,
            status,
        ],
    )

    return <WalletContext.Provider value={ctx}>{children}</WalletContext.Provider>
}
