import * as PusherPushNotifications from '@pusher/push-notifications-web'
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'

import { config } from '../config'
import { isIframe } from '../utils/isIframe'
import { useWallet } from './ConnectProvider'

let beamsClient: null | PusherPushNotifications.Client = null

try {
    if (!isIframe) {
        beamsClient = new PusherPushNotifications.Client({
            instanceId: config.pusherNotificationInstanceId,
        })
    }
} catch (e) {
    console.log(e)
}

const isSupported = !!beamsClient

function isGranted() {
    return window.Notification.permission === 'granted'
}

async function start() {
    if (!beamsClient) return

    await beamsClient.start()
    await beamsClient.addDeviceInterest('game-reminders')
}

interface PushContextValue {
    isSupported: boolean
    enabled: boolean
    enable(): void
}

const PushContext = createContext<PushContextValue | null>(null)

export function usePush() {
    const ctx = useContext(PushContext)

    if (ctx == null) {
        throw new Error('usePush must be used within PushProvider')
    }

    return ctx
}

export function PushProvider({ children }: { children: ReactNode }) {
    const [granted, setGranted] = useState(isGranted())

    useEffect(() => {
        if (isGranted() && beamsClient) {
            start().catch(console.error)
        }
    }, [granted])

    const wallet = useWallet()
    const [supported, setSupported] = useState(Boolean(isSupported && wallet.token))
    useEffect(() => setSupported(Boolean(isSupported && wallet.token)), [wallet.token])

    const ctx: PushContextValue = useMemo(
        () => ({
            isSupported: supported,
            enabled: granted,
            enable: () => {
                start()
                    .then(() => setGranted(isGranted()))
                    .catch(() => {
                        // TODO fancy notifications
                        // eslint-disable-next-line no-alert
                        alert('Enable notifications in browser settings')
                    })
            },
        }),
        [granted, supported],
    )

    return <PushContext.Provider value={ctx}>{children}</PushContext.Provider>
}
