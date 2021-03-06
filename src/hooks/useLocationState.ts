import { Location, useLocation } from 'react-router-dom'

export function useLocationState<T extends { fromApp?: boolean } & Record<string, unknown>>(location?: Location) {
    const _location = useLocation()
    location = location || _location

    return (location.state || {}) as Partial<T>
}
