import * as PusherPushNotifications from '@pusher/push-notifications-web'
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'

import { analytics } from '../analytics'
import { config } from '../config'
import { extractErrorMessage } from '../utils/error'
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
    try {
        return window.Notification.permission === 'granted'
    } catch {
        return false
    }
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

    const ctx: PushContextValue = useMemo(
        () => ({
            isSupported: Boolean(isSupported && wallet.token),
            enabled: granted,
            enable: () => {
                start()
                    .then(() => {
                        setGranted(isGranted())
                        analytics.logEvent('push_notification_successful')
                    })
                    .catch((err) => {
                        // TODO fancy notifications
                        // eslint-disable-next-line no-alert
                        alert('Enable notifications in browser settings')

                        analytics.logEvent('push_notification_failed', { reason: extractErrorMessage(err) })
                    })
            },
        }),
        [granted, wallet.token],
    )

    return <PushContext.Provider value={ctx}>{children}</PushContext.Provider>
}
