import { useEffect, useState } from 'react'

export function useNonce() {
    const [nonce, setNonce] = useState(() => Date.now())

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNonce(Date.now)
        }, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [])

    return nonce
}
