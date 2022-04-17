import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { analytics } from '../analytics'
import { Dialog } from '../components/Dialog'
import { Link } from '../components/Link'
import { urls } from '../config'
import { useWallet } from '../containers/ConnectProvider'
import { useBackgroundLocation } from '../hooks/useBackgroundLocation'
import { useLocationState } from '../hooks/useLocationState'

export function ConnectModal() {
    const wallet = useWallet()
    const navigate = useNavigate()
    const bgLocation = useBackgroundLocation()

    const { fromApp } = useLocationState()
    useEffect(() => {
        analytics.logEvent('connect_modal_open', { fromApp })
    }, [fromApp])

    if (wallet.status === 'idle' && !wallet.ready) {
        return (
            <Dialog close={() => navigate(bgLocation?.pathname || '/', { state: { fromApp: true } })}>
                <Link to={urls.external.phantom} underline>
                    {urls.external.phantom}
                </Link>
            </Dialog>
        )
    }

    if (wallet.ready) {
        return <Navigate to="/" />
    }

    return null
}
