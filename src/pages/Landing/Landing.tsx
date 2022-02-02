import { Navigate, Route, Routes } from 'react-router-dom'

import { useReplayQuery } from '../../api/query'
import { Box, Stack, globalCss, styled } from '../../design-system'
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
                    <NextGameSection participateUrl={`#${howToStartId}`} />
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

export function Landing() {
    return (
        <Routes>
            <Route path="_replay" element={<Replay />} />
            <Route path="/" element={<Index />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}
