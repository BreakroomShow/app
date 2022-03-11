import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

const locations = new Set<string>()

export function useScrollRestore() {
    const location = useLocation()

    useLayoutEffect(() => {
        if (!location.key) return
        if (locations.has(location.key)) return

        locations.add(location.key)
        window.scrollTo(0, 0)
    }, [location.key])
}
