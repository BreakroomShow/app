import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { analytics } from '../../analytics'
import { useReplayQuery } from '../../api/query'
import { Dialog } from '../../components/Dialog'
import { Link } from '../../components/Link'
import { urls } from '../../config'
import { useWallet } from '../../containers/ConnectProvider'
import { Stack } from '../../design-system'
import { useBackgroundLocation } from '../../hooks/useBackgroundLocation'
import { useHtmlAnchor } from '../../hooks/useHtmlAnchor'
import { useLocationState } from '../../hooks/useLocationState'
import { lazy } from '../../utils/lazy'
import { FaqSection } from './components/FaqSection'
import { GameReplaySection } from './components/GameReplaySection'
import { GoalSection } from './components/GoalSection'
import { HeadlineSection } from './components/HeadlineSection'
import { HowItWorksSection } from './components/HowItWorksSection'
import { HowToStartSection } from './components/HowToStartSection'
import { NextGameSection } from './components/NextGameSection'
import { Page } from './components/Page'
import { PageContent } from './components/PageContent'
import { PageFooter } from './components/PageFooter'
import { PageHeader } from './components/PageHeader'
import { PageLinkButton } from './components/PageLinkButton'
import { PageSpacer } from './components/PageSpacer'
import { TransparencySection } from './components/TransparencySection'
import { Welcome } from './Welcome'

const Replay = lazy(() => import(/* webpackChunkName: "Replay" */ './Replay').then((m) => m.Replay), null)
useReplayQuery.preload()

function Index() {
    const eventPrefix = 'main'

    useEffect(() => {
        analytics.logEvent('main_page_open')
    }, [])

    return (
        <Page>
            <PageContent css={{ paddingTop: 70, '@down-lg': { paddingTop: 25 } }}>
                <Stack dividers={<PageSpacer />}>
                    <PageHeader eventPrefix={eventPrefix} />
                    <HeadlineSection />
                    <NextGameSection>
                        <PageLinkButton {...useHtmlAnchor(HowItWorksSection.id)}>How it works</PageLinkButton>
                    </NextGameSection>
                    <GameReplaySection />
                </Stack>
            </PageContent>
            <HowItWorksSection />
            <HowToStartSection />
            <TransparencySection />
            <PageSpacer />
            <PageContent>
                <Stack dividers={<PageSpacer />}>
                    <FaqSection />
                    <GoalSection />
                    <PageFooter eventPrefix={eventPrefix} />
                </Stack>
            </PageContent>
        </Page>
    )
}

function ConnectModal() {
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

export function Landing() {
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
                <Route path="/" element={<Index />} />
                <Route path={urls.pages.welcome} element={<Welcome />} />
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
