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

import { analytics } from '../analytics'
import { authorize } from '../api'
import { config } from '../config'
import { useGetLatest } from '../hooks/useGetLatest'
import { useIsUnloading } from '../hooks/useIsUnloading'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { extractErrorMessage } from '../utils/error'
import { isIframe } from '../utils/isIframe'

type Token = string & {}

type ConnectState =
    | { status: 'idle'; token: null; publicKey: null }
    | { status: 'auto-connecting'; token: null; publicKey: null }
    | { status: 'connecting'; token: null; publicKey: null }
    | { status: 'signing'; token: null; publicKey: solana.PublicKey | null }
    | { status: 'connected'; token: Token; publicKey: solana.PublicKey }
    | { status: 'disconnecting'; token: null; publicKey: solana.PublicKey }

type WalletContextState = ConnectState &
    Pick<WalletAdapterProps, 'publicKey' | 'ready' | 'connect' | 'disconnect' | 'sendTransaction'> &
    SignerWalletAdapterProps &
    MessageSignerWalletAdapterProps & {
        isPending: boolean
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
    const [autoConnect, setAutoConnect] = useLocalStorage('autoConnect', false)

    const [connectState, setStatus] = useState<ConnectState>({
        status: autoConnect ? 'auto-connecting' : 'idle',
        token: null,
        publicKey: null,
    })

    const { status } = connectState

    const [adapter, setAdapter] = useState<ReturnType<typeof wallet['adapter']> | null>(null)
    const [ready, setReady] = useState(false)

    const [_tokenCache, _setTokenCache] = useLocalStorage<{ [pKey in string]?: Token }>(`token_cache`, {})
    const getCachedToken = useGetLatest((pKey: WalletContextState['publicKey']) => _tokenCache?.[String(pKey)] || null)
    const setTokenCache = useGetLatest((pKey: WalletContextState['publicKey'], newToken?: Token) => {
        if (!pKey) _setTokenCache({})
        else _setTokenCache({ [String(pKey)]: newToken })
    })

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
        }
    }, [])

    const onConnected = useCallback(
        (token: Token) => {
            if (!adapter) return

            setReady(adapter.ready)

            if (adapter.connected && adapter.publicKey) {
                setStatus({ status: 'connected', token, publicKey: adapter.publicKey })
                setAutoConnect(true)
            } else {
                setStatus({ status: 'idle', token: null, publicKey: null })
            }
        },
        [adapter, setAutoConnect],
    )

    const onConnectFailed = useCallback(() => {
        setAutoConnect(false)
        setStatus({ status: 'idle', token: null, publicKey: null })
    }, [setAutoConnect])

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
        if (status !== 'connected' && status !== 'signing') throw new WalletNotConnectedError()

        return adapter.signMessage(message)
    })

    const disconnect = useCallback(async () => {
        if (!adapter) return
        if (status === 'disconnecting') return

        setStatus((prev) => ({ status: 'disconnecting', token: null, publicKey: prev.publicKey! }))
        setAutoConnect(false)
        setTokenCache(null)

        try {
            await adapter.disconnect()

            analytics.logEvent('disconnect_successful', { publicKey: adapter.publicKey?.toString() })

            setStatus({ status: 'idle', token: null, publicKey: null })
        } catch (DisconnectError) {
            console.error({ DisconnectError })

            const token = getCachedToken(adapter.publicKey)
            if (token) onConnected(token)
            else onConnectFailed()

            analytics.logEvent('disconnect_failed', { reason: extractErrorMessage(DisconnectError) })

            throw DisconnectError
        }
    }, [adapter, getCachedToken, onConnectFailed, onConnected, setAutoConnect, setTokenCache, status])

    const signup = useGetLatest(async (pKey: WalletContextState['publicKey']) => {
        const _token = getCachedToken(pKey)

        if (_token) return _token

        setStatus({ status: 'signing', token: null, publicKey: pKey })

        return authorize({ sign: signMessage, publicKey: pKey })
            .then((result) => {
                setTokenCache(pKey, result)

                analytics.logEvent('signup_successful', { token: result })

                return result
            })
            .catch((error) => {
                disconnect()

                analytics.logEvent('connect_failed', { reason: extractErrorMessage(error) })

                throw error
            })
    })

    const connect = useCallback(async () => {
        if (status === 'connecting' || status === 'connected' || status === 'disconnecting') return

        if (!adapter) throw new WalletNotSelectedError()
        if (!ready) throw new WalletNotReadyError()

        setStatus({ status: 'connecting', token: null, publicKey: null })

        try {
            await adapter.connect()
            const token = await signup(adapter.publicKey)

            onConnected(token)

            analytics.logEvent('connect_successful', { publicKey: adapter.publicKey?.toString() })
        } catch (ConnectError) {
            console.error({ ConnectError })
            onConnectFailed()

            analytics.logEvent('connect_failed', { reason: extractErrorMessage(ConnectError) })

            throw ConnectError
        }
    }, [adapter, onConnectFailed, onConnected, ready, signup, status])

    useEffect(() => {
        async function onAutoConnect() {
            if (isUnloading.current) return
            if (!autoConnect) return
            if (!adapter) return

            if (!ready) {
                setStatus({ status: 'idle', token: null, publicKey: null })
                return
            }

            if (status !== 'idle' && status !== 'auto-connecting') return

            setStatus({ status: 'connecting', token: null, publicKey: null })

            try {
                await adapter.connect()
                const token = await signup(adapter.publicKey)
                onConnected(token)

                analytics.logEvent('autoconnect_successful')
            } catch (AutoConnectError) {
                onConnectFailed()
                console.error({ AutoConnectError })

                analytics.logEvent('autoconnect_failed', { reason: extractErrorMessage(AutoConnectError) })
            }
        }

        onAutoConnect()
    }, [adapter, autoConnect, isUnloading, onConnectFailed, onConnected, ready, signup, status])

    useEffect(() => {
        if (!adapter) return

        const onReady = () => setReady(adapter.ready)

        adapter.on('ready', onReady)

        return () => {
            adapter.off('ready', onReady)
        }
    }, [adapter])

    const ctx: WalletContextState = useMemo(() => {
        const pendingStatuses: typeof status[] = ['auto-connecting', 'connecting', 'signing', 'disconnecting']
        const isPending = pendingStatuses.includes(connectState.status)

        return {
            ...connectState,
            isPending,
            wallet,
            adapter,
            ready,
            cluster,
            setCluster,
            connection,
            connect,
            disconnect,
            sendTransaction,
            signTransaction,
            signAllTransactions,
            signMessage,
        }
    }, [
        adapter,
        cluster,
        connect,
        connection,
        disconnect,
        ready,
        sendTransaction,
        signAllTransactions,
        signMessage,
        signTransaction,
        connectState,
    ])

    return <WalletContext.Provider value={ctx}>{children}</WalletContext.Provider>
}
