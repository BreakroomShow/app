import { useWallet } from '@solana/wallet-adapter-react'
import bs58 from 'bs58'
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { createToken, getMessageToSign } from '../api/methods'
import { useGetLatest } from '../hooks/useGetLatest'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { msToDateString } from '../utils/date'

type AuthState =
    | { status: 'idle'; error: null; token: null }
    | { status: 'connecting'; error: null; token: null }
    | { status: 'connected'; error: null; token: string }
    | { status: 'error'; error: Error; token: null }

const AuthContext = createContext<null | (AuthState & { authorize(): void })>(null)

const idleState: AuthState = { status: 'idle', error: null, token: null }

export function useAuth() {
    const ctx = useContext(AuthContext)

    if (ctx == null) {
        throw new Error('useAuth must be used within AuthProvider')
    }

    return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const { publicKey, signMessage } = useWallet()
    const canSign = !!signMessage
    const sign = useGetLatest((message) => (signMessage ? signMessage(message) : null))

    const [tokens, setTokens] = useLocalStorage<{ [pKey in string]?: string }>('tokens', {})
    const token = tokens[String(publicKey)] || null

    const [state, setState] = useState<AuthState>(token ? { status: 'connected', error: null, token } : idleState)

    const authorize = useCallback(async () => {
        try {
            if (!publicKey) throw new Error(`Wallet is not connected`)

            const nonce = Date.now()
            const publicKeyString = publicKey.toString()
            const nonceString = Date.now().toString()
            const issuedAtString = msToDateString(nonce)

            const message = await getMessageToSign({
                publicKey: publicKeyString,
                nonce: nonceString,
                issuedAt: issuedAtString,
            })

            if (!message) throw new Error(`Can't get message to sign`)

            const signature = await sign(new TextEncoder().encode(message))

            if (!signature) throw new Error(`Can't sign message`)

            const result = await createToken({
                publicKey: publicKeyString,
                nonce: nonceString,
                issuedAt: issuedAtString,
                signature: bs58.encode(signature),
            })

            if (!result) throw new Error(`Can't get token`)

            return result
        } catch (err) {
            console.error({ AuthError: err })

            const msg = err instanceof Error ? err.message : 'Auth error'

            throw new Error(msg)
        }
    }, [publicKey, sign])

    useEffect(() => {
        if (!publicKey) {
            return setState((prev) => (prev.status === 'idle' ? prev : idleState))
        }

        if (!canSign) {
            return setState({
                status: 'error',
                token: null,
                error: new Error('Wallet does not support message signing!'),
            })
        }

        if (token) {
            return setState({ status: 'connected', token, error: null })
        }

        setState({ status: 'connecting', token: null, error: null })

        authorize()
            .then((result) => setTokens({ [String(publicKey)]: result }))
            .catch((error) => setState({ status: 'error', token: null, error }))
    }, [publicKey, canSign, token, authorize, setTokens])

    const ctx = useMemo(() => ({ ...state, authorize }), [authorize, state])

    return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>
}
