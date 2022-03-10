import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export function useQueryParams() {
    const location = useLocation()
    const search = location.search || window.location.search
    return useMemo(() => new URLSearchParams(search), [search])
}
