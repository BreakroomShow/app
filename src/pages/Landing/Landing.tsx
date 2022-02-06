import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { useReplayQuery } from '../../api/query'
import { Dialog } from '../../components/Dialog'
import { Box, Stack, globalCss, styled } from '../../design-system'
import { useBackgroundLocation } from '../../hooks/useBackgroundLocation'
import { lazy } from '../../utils/lazy'
import { GameReplaySection } from './components/GameReplaySection'
import { GameRulesSection } from './components/GameRulesSection'
import { HowToStartSection, howToStartId } from './components/HowToStartSection'
import { LeaderboardSection } from './components/LeaderboardSection'
import { NextGameSection } from './components/NextGameSection'
import { PageContent } from './components/PageContent'
import { PageFooter } from './components/PageFooter'
import { PageHeader } from './components/PageHeader'
import { PageSpacer } from './components/PageSpacer'
import { PageTitle } from './components/PageTitle'

const Replay = lazy(() => import(/* webpackChunkName: "Replay" */ './Replay').then((m) => m.Replay), null)
useReplayQuery.preload()

const styles = globalCss({
    html: { background: '$blue' },
    body: { background: '$background', color: '$black' },
})

const FooterContainer = styled(Box, {
    paddingTop: 150,
    marginTop: -150,
    paddingBottom: 65,
    background: '$blue',
})

function Index() {
    styles()

    return (
        <>
            <PageContent css={{ paddingTop: 70, '@down-lg': { paddingTop: 25 } }}>
                <Stack dividers={<PageSpacer />}>
                    <PageHeader />
                    <PageTitle />
                    <NextGameSection howToStartId={howToStartId} />
                    <GameReplaySection />
                    <GameRulesSection />
                </Stack>
            </PageContent>
            <PageSpacer />
            <HowToStartSection />
            <FooterContainer>
                <PageSpacer />
                <PageContent>
                    <LeaderboardSection />
                    <PageSpacer />
                    <PageFooter />
                </PageContent>
            </FooterContainer>
        </>
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

    return <Dialog close={() => navigate(bgLocation?.pathname || '/')}>Connect</Dialog>
}

export function Landing() {
    const location = useLocation()
    const bgLocation = useBackgroundLocation()

    return (
        <>
            <Routes location={bgLocation || location}>
                <Route path="_replay" element={<Replay />} />
                <Route path="/" element={<Index />} />
                <Route path="/connect" element={<Navigate to="/" state={{ bgLocation: { pathname: '/' } }} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            {bgLocation ? (
                <Routes>
                    <Route path="/connect" element={<ConnectModal />} />
                </Routes>
            ) : null}
        </>
    )
}
