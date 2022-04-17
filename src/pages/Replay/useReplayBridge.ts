import { ReactEventHandler, useEffect, useState } from 'react'

import { bridgeFactory } from '../../utils/bridge'

type ReplayBridgeEvents = {
    Play: boolean
}

const getBridge = (target: Window) => bridgeFactory<ReplayBridgeEvents>(target)

export const { subscribe, init } = getBridge(window)

export function useReplayState(isReady: boolean) {
    const [play, setPlay] = useState(false)

    useEffect(() => {
        if (!isReady) return

        const unsubscribe = subscribe('Play', setPlay)

        init()

        return unsubscribe
    }, [isReady])

    return play
}

export function useReplayBridge() {
    const [bridge, setBridge] = useState<ReturnType<typeof getBridge> | null>(null)

    const onLoad: ReactEventHandler<HTMLIFrameElement> = (event) => {
        try {
            const iframeWindow = event.currentTarget.contentWindow

            if (iframeWindow) {
                const bridgeInstance = getBridge(iframeWindow)
                bridgeInstance.onReady(() => setBridge(bridgeInstance))
            }
        } catch (e) {
            console.error(e)
        }
    }

    return [bridge, onLoad] as const
}
