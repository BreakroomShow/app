import Pusher from 'pusher-js'
import { useEffect } from 'react'

import { config } from '../config'
import { useGetLatest } from '../hooks/useGetLatest'
import { ChatMessage, GameEvent } from '../types'

const pusher = new Pusher(config.pusherAppKey, { cluster: config.pusherCluster })

type EventMap<T extends { type: string } = GameEvent> = {
    [Type in T['type']]: Extract<T, { type: Type }>
} & {
    new_message: ChatMessage
}

type ChannelName = string | null | undefined

export function useSocketEvent<Event extends keyof EventMap>(
    channel: ChannelName,
    event: Event | Event[],
    cb: (data: EventMap[Event]) => void,
): void
export function useSocketEvent<Event extends keyof EventMap>(
    channel: ChannelName,
    map: { [Key in Event]: (data: EventMap[Key]) => void },
): void
export function useSocketEvent<Event extends keyof EventMap>(
    channelName: ChannelName,
    events: Event | Event[] | { [Key in Event]: (data: EventMap[Event]) => void },
    cb?: (data: EventMap[Event]) => void,
): void {
    const getArgs = useGetLatest(() => ({ event: events, listener: cb }))

    useEffect(() => {
        if (!channelName) return

        const channel = pusher.subscribe(channelName)

        const { event, listener } = getArgs()

        let map: { [key in Event]?: (d: EventMap[Event]) => void } = {}

        if (typeof event === 'string') {
            map[event] = listener
        } else if (Array.isArray(event)) {
            event.forEach((e) => {
                map[e] = listener
            })
        } else if (typeof event === 'object') {
            map = event
        }

        Object.keys(map).forEach((key) => {
            const callback = map[key as Event]

            if (callback) channel.bind(key, callback)
        })

        return () => {
            channel.unbind_all()
            channel.unsubscribe()
            channel.disconnect()
        }
    }, [channelName, getArgs])
}
