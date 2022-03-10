import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { useReplayQuery } from '../../api/query'
import { Dialog } from '../../components/Dialog'
import { Link } from '../../components/Link'
import { urls } from '../../config'
import { Stack } from '../../design-system'
import { useBackgroundLocation } from '../../hooks/useBackgroundLocation'
import { htmlAnchor } from '../../utils/htmlAnchor'
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
    return (
        <Page>
            <PageContent css={{ paddingTop: 70, '@down-lg': { paddingTop: 25 } }}>
                <Stack dividers={<PageSpacer />}>
                    <PageHeader />
                    <HeadlineSection />
                    <NextGameSection>
                        <PageLinkButton {...htmlAnchor(HowItWorksSection.id)}>How it works</PageLinkButton>
                    </NextGameSection>
                    <GameReplaySection />
                </Stack>
            </PageContent>
            <HowItWorksSection />
            <HowToStartSection>
                <PageLinkButton {...htmlAnchor('TODO')}>Sign up for the game</PageLinkButton>
            </HowToStartSection>
            <TransparencySection />
            <PageSpacer />
            <PageContent>
                <Stack dividers={<PageSpacer />}>
                    <FaqSection />
                    <GoalSection />
                    <PageFooter />
                </Stack>
            </PageContent>
        </Page>
    )
}

/**
 Check happy path first. If it's connected, it's connected. No need to check the environment/setup.

 If mobile:
    android - sorry message "connect using PC"
    iOS - phantom app link

 PC Browser:
    browser is supported: phantom site link
    otherwise: enumerate supported browsers

type ConnectStatus =
    | 'idle' // checking for connection/browser support
    // happy path
    | 'disconnected' // valid setup but not connected
    | 'connecting' // connecting wallet and checking balance
    | 'connected' // complete state
    // `connected` but requirements aren't met
    | 'no-sol' // 0,01 sol
    // setup error
    | 'browser-not-supported' // pc not chrome/brave/mozilla/edge
    | 'android-not-supported' // just android
    | 'pc-not-phantom' // valid browser but no phantom/solana interface
    | 'mobile-not-phantom' // ios but no phantom/solana interface
*/

function ConnectModal() {
    const navigate = useNavigate()
    const bgLocation = useBackgroundLocation()

    return (
        <Dialog close={() => navigate(bgLocation?.pathname || '/')}>
            <Link to={urls.external.phantom} underline>
                {urls.external.phantom}
            </Link>
        </Dialog>
    )
}

export function Landing() {
    const location = useLocation()
    const bgLocation = useBackgroundLocation()

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
