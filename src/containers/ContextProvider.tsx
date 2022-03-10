import { ReactNode, useEffect } from 'react'

import { StyleProvider } from '../design-system'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useQueryParams } from '../hooks/useQueryParams'
import { ConnectProvider } from './ConnectProvider'
import { PushProvider } from './PushProvider'
import { QueryProvider } from './QueryProvider'

export function ContextProvider({ children }: { children: ReactNode }) {
    const [referral, setReferral] = useLocalStorage<null | { ref: string; time: number }>('referral', null)
    const params = useQueryParams()
    const refParam = params.get('ref')

    useEffect(() => {
        if (referral || !refParam) return

        setReferral({ ref: refParam, time: Date.now() })
    }, [refParam, referral, setReferral])

    return (
        <StyleProvider>
            <ConnectProvider>
                <QueryProvider>
                    <PushProvider>{children}</PushProvider>
                </QueryProvider>
            </ConnectProvider>
        </StyleProvider>
    )
}
