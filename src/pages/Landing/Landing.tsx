import { useEffect } from 'react'

import { analytics } from '../../analytics'
import { Page, Stack } from '../../design-system'
import { useHtmlAnchor } from '../../hooks/useHtmlAnchor'
import { FaqSection } from './components/FaqSection'
import { GameReplaySection } from './components/GameReplaySection'
import { GoalSection } from './components/GoalSection'
import { HeadlineSection } from './components/HeadlineSection'
import { HowItWorksSection } from './components/HowItWorksSection'
import { HowToStartSection } from './components/HowToStartSection'
import { NextGameSection } from './components/NextGameSection'
import { PageContent } from './components/PageContent'
import { PageFooter } from './components/PageFooter'
import { PageHeader } from './components/PageHeader'
import { PageLinkButton } from './components/PageLinkButton'
import { PageSpacer } from './components/PageSpacer'
import { TransparencySection } from './components/TransparencySection'

export function Landing() {
    const eventPrefix = 'main'

    useEffect(() => {
        analytics.logEvent('main_page_open')
    }, [])

    const howItWorksLink = useHtmlAnchor(HowItWorksSection.id)

    return (
        <Page>
            <PageContent css={{ paddingTop: 70, '@down-lg': { paddingTop: 25 } }}>
                <Stack dividers={<PageSpacer />}>
                    <PageHeader eventPrefix={eventPrefix} />
                    <HeadlineSection />
                    <NextGameSection>
                        <PageLinkButton {...howItWorksLink}>How it works</PageLinkButton>
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
