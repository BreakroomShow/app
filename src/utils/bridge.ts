type BaseEventMap =
    | {
          BridgeHandshake?: null
          BridgeInitialized?: null
      }
    | { [event: string]: unknown }

export function bridgeFactory<EventMap extends BaseEventMap>(target: Window) {
    const listenersMap = new Map<keyof EventMap, Array<(data: EventMap[keyof EventMap]) => void>>()

    function currentListeners<Event extends keyof EventMap>(event: Event) {
        return listenersMap.get(event) || []
    }

    function eventListener(event: MessageEvent<unknown>) {
        try {
            type Message = {
                [Key in keyof EventMap]: { key: Key; data: EventMap[Key] }
            }[keyof EventMap]

            if (typeof event.data !== 'string') return

            const message: Message = JSON.parse(event.data)

            const listeners = currentListeners(message.key)

            listeners.forEach((listener) => listener(message.data))
        } catch (e) {
            console.error(e)
        }
    }

    function setListeners(event: keyof EventMap, listeners: Array<(data: EventMap[keyof EventMap]) => void>) {
        if (listeners.length) {
            if (!listenersMap.size) {
                target.addEventListener('message', eventListener)
            }

            listenersMap.set(event, listeners)
            return
        }

        listenersMap.delete(event)

        if (!listenersMap.size) {
            target.removeEventListener('message', eventListener)
        }
    }

    function subscribe<Event extends keyof EventMap, Data extends EventMap[Event]>(
        event: Event,
        listener: (data: Data) => void,
    ): () => void {
        const listeners = currentListeners(event)

        setListeners(event, [...listeners, listener] as typeof listeners)

        return () => {
            setListeners(
                event,
                currentListeners(event).filter((l) => l !== listener),
            )
        }
    }

    function postMessage<Event extends keyof EventMap, Data extends EventMap[Event]>(key: Event, data: Data) {
        try {
            const message = JSON.stringify({ key, data })

            const event = new MessageEvent('message', { data: message })
            target.dispatchEvent(event)
        } catch (e) {
            console.error(e)
        }
    }

    function init() {
        const intervalId = setInterval(() => {
            postMessage('BridgeHandshake', null)
        }, 500)

        const unsubscribeInit = subscribe('BridgeInitialized', () => {
            clearInterval(intervalId)
            unsubscribeInit()
        })

        return unsubscribeInit
    }

    function onReady(callback: () => void) {
        subscribe('BridgeHandshake', () => {
            postMessage('BridgeInitialized', null)
            callback()
        })
    }

    return {
        init,
        onReady,
        postMessage,
        subscribe,
    }
}
