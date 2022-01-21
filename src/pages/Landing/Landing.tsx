import { Box, Stack, globalCss, styled } from '../../design-system'
import { GameReplaySection } from './components/GameReplaySection'
import { GameRulesSection } from './components/GameRulesSection'
import { HowToStartSection } from './components/HowToStartSection'
import { LeaderboardSection } from './components/LeaderboardSection'
import { NextGameSection } from './components/NextGameSection'
import { PageContent } from './components/PageContent'
import { PageFooter } from './components/PageFooter'
import { PageHeader } from './components/PageHeader'
import { PageSpacer } from './components/PageSpacer'
import { PageTitle } from './components/PageTitle'

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

export function Landing() {
    styles()

    return (
        <>
            <PageContent css={{ paddingTop: 70, '@down-lg': { paddingTop: 25 } }}>
                <Stack dividers={<PageSpacer />}>
                    <PageHeader />
                    <PageTitle />
                    <NextGameSection />
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
