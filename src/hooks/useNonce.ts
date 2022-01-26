import { useCallback, useEffect, useRef, useState } from 'react'

interface NonceOptions {
    delay?: number
    active?: boolean
}

export function useNonce({ delay, active }: NonceOptions = { delay: 1000, active: true }) {
    const [nonce, setNonce] = useState(() => Date.now())
    const intervalRef = useRef<number>()

    const stop = useCallback(() => {
        window.clearInterval(intervalRef.current)
        intervalRef.current = undefined
    }, [])

    const start = useCallback(() => {
        intervalRef.current = intervalRef.current || window.setInterval(() => setNonce(Date.now), delay)
    }, [delay])

    useEffect(() => {
        if (active) start()
        else stop()

        return stop
    }, [active, delay, start, stop])

    return { nonce, stop, start }
}
