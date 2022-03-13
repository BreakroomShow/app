import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { useBackgroundLocation } from './useBackgroundLocation'
import { usePrevious } from './usePrevious'

const locations = new Set<string>()

export function useScrollRestore() {
    const location = useLocation()
    const bgLocation = useBackgroundLocation()
    const hasBgLocation = !!bgLocation
    const hadBgLocation = usePrevious(hasBgLocation)
    const disable = hadBgLocation || hasBgLocation

    useLayoutEffect(() => {
        if (disable) return
        if (!location.key) return
        if (locations.has(location.key)) return

        locations.add(location.key)
        window.scrollTo(0, 0)
    }, [disable, location.key])
}
