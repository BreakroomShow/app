import { Location, useLocation } from 'react-router-dom'

export function useBackgroundLocation() {
    const location = useLocation()
    const state = location.state as null | { bgLocation?: Location }
    return state?.bgLocation || null
}
