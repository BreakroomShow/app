import { ReactNode, useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { analytics } from './analytics'
import { useCurrentGameQuery, useReplayQuery } from './api/query'
import { urls } from './config'
import { useWallet } from './containers/ConnectProvider'
import { useBackgroundLocation } from './hooks/useBackgroundLocation'
import { useTime } from './hooks/useTime'
import { ConnectModal } from './pages/ConnectModal'
import { Game } from './pages/Game'
import { Landing } from './pages/Landing'
import { Welcome } from './pages/Welcome'
import { dateStringToMs } from './utils/date'
import { lazy } from './utils/lazy'

const Replay = lazy(() => import(/* webpackChunkName: "Replay" */ './pages/Replay').then((m) => m.Replay), null)
useReplayQuery.preload()
useCurrentGameQuery.preload()

const enableRouteGuard = false

function GameAwareRoute({ children }: { children: ReactNode }) {
    const wallet = useWallet()
    const { data: currentGame } = useCurrentGameQuery()
    const time = useTime()
    const shouldOpenGame =
        currentGame && wallet.status === 'connected'
            ? time.moreThan(dateStringToMs(currentGame.chain_start_time))
            : false

    if (shouldOpenGame && enableRouteGuard) {
        return <Navigate to={urls.pages.game} />
    }

    return <>{children}</>
}

function GameGuard({ children }: { children: ReactNode }) {
    const { status, ready, connect } = useWallet()
    const navigate = useNavigate()
    const attempted = useRef(false)

    useEffect(() => {
        if (!ready) return
        if (attempted.current) return

        if (status === 'idle') {
            connect()
        }

        attempted.current = true
    }, [ready, connect, navigate, status])

    const { data: currentGame } = useCurrentGameQuery()
    const time = useTime()

    const shouldRedirect = currentGame ? !time.moreThan(dateStringToMs(currentGame.chain_start_time)) : false

    if (shouldRedirect && enableRouteGuard) {
        return <Navigate to="/" />
    }

    return <>{children}</>
}

export function App() {
    const location = useLocation()
    const bgLocation = useBackgroundLocation()

    const wallet = useWallet()
    const userId = wallet.publicKey?.toString()
    useEffect(() => {
        if (userId) analytics.setUserId(userId)
    }, [userId])

    useEffect(() => {
        function onUnload() {
            analytics.logEvent('document_unload', { path: location.pathname })
        }

        window.addEventListener('beforeunload', onUnload)

        return () => window.removeEventListener('beforeunload', onUnload)
    }, [location.pathname])

    return (
        <>
            <Routes location={bgLocation || location}>
                <Route path="_replay" element={<Replay />} />
                <Route
                    path="/"
                    element={
                        <GameAwareRoute>
                            <Landing />
                        </GameAwareRoute>
                    }
                />
                <Route
                    path={urls.pages.welcome}
                    element={
                        <GameAwareRoute>
                            <Welcome />
                        </GameAwareRoute>
                    }
                />
                <Route
                    path={urls.pages.game}
                    element={
                        <GameGuard>
                            <Game />
                        </GameGuard>
                    }
                />
                <Route
                    path={urls.pages.connect}
                    element={<Navigate to={urls.pages.connect} state={{ bgLocation: { pathname: '/' } }} />}
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            {bgLocation ? (
                <Routes>
                    <Route path={urls.pages.connect} element={<ConnectModal />} />
                </Routes>
            ) : null}
        </>
    )
}
