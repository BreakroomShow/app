import { useCallback, useEffect, useRef, useState } from 'react'

export function useNonce({ delay } = { delay: 1000 }) {
    const [nonce, setNonce] = useState(() => Date.now())
    const intervalRef = useRef<number>()

    const stop = useCallback(() => {
        window.clearInterval(intervalRef.current)
    }, [])

    useEffect(() => {
        intervalRef.current = window.setInterval(() => {
            setNonce(Date.now)
        }, delay)

        return stop
    }, [delay, stop])

    return [nonce, stop] as const
}
