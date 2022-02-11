import { useEffect, useRef } from 'react'

export function useIsUnloading() {
    const isUnloading = useRef(false)

    useEffect(() => {
        function onUnload() {
            isUnloading.current = true
        }

        window.addEventListener('beforeunload', onUnload)

        return () => window.removeEventListener('beforeunload', onUnload)
    }, [])

    return isUnloading
}
