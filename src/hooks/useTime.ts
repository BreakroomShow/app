import { useEffect, useRef } from 'react'

import { useForceUpdate } from './useForceUpdate'

export function useTime() {
    const forceUpdate = useForceUpdate()
    const timers = useRef(new Set<number>())
    const updated = useRef(new Set<number>())

    useEffect(() => {
        const intervalId = setInterval(() => {
            let shouldUpdate = false

            timers.current.forEach((ms) => {
                if (updated.current.has(ms)) return

                if (Date.now() >= ms) {
                    updated.current.add(ms)
                    shouldUpdate = true
                }
            })

            if (shouldUpdate) forceUpdate()
        }, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [forceUpdate])

    return {
        lessThan(ms: number): boolean {
            timers.current.add(ms)
            return Date.now() < ms
        },
        moreThan(ms: number): boolean {
            timers.current.add(ms)
            return Date.now() > ms
        },
    }
}
