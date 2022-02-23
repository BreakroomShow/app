import { Box, Column, Columns, Stack, Text, Typography, styled } from '../../../design-system'
import { nbsp } from '../../../utils/nbsp'
import { PageBlock } from './PageBlock'
import { PageContent } from './PageContent'
import { PageSpacer } from './PageSpacer'
import { SectionTitle } from './SectionTitle'

const Container = styled(PageBlock, {
    $$offset: '60px',
    marginTop: 'calc(-1 * $$offset)',
    '@down-xl': { $$offset: '30px' },
    '@down-sm': { $$offset: '0' },
})

const Icon = styled(Box, {
    height: 86,
    width: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
})

HowItWorksSection.id = 'how-it-works'

export function HowItWorksSection() {
    const rules = [
        { icon: <div />, title: '12 questions', description: `for everyone` },
        { icon: <div />, title: '10 seconds', description: `to answer a${nbsp}question` },
        { icon: <div />, title: '1 extra life', description: 'for each invited friend' },
    ]

    return (
        <Container variant="light">
            <PageContent>
                <Stack align="center" space="sm">
                    <SectionTitle id={HowItWorksSection.id}>How it works</SectionTitle>
                    <Text font="body" size="md" color="blackA" align="center" preserveLinebreaks>
                        Games are hosted throughout the week.{'\n'}The prize fund is split between players who answered
                        correctly to all questions.
                    </Text>
                </Stack>
                <PageSpacer />
                <Columns space={{ '@all': 'xl', '@down-lg': 'xxl' }} collapseBelow="@down-lg">
                    {rules.map((i) => (
                        <Column key={i.title} width={1 / 3}>
                            <Stack space="md" align="center">
                                <Icon>{i.icon}</Icon>
                                <Stack space="xxs">
                                    <Typography as="h1" align="center">
                                        {i.title}
                                    </Typography>
                                    <Text font="body" color="greyA" size="md" align="center">
                                        {i.description}
                                    </Text>
                                </Stack>
                            </Stack>
                        </Column>
                    ))}
                </Columns>
            </PageContent>

            <PageSpacer />

            <p style={{ textAlign: 'center' }}>TODO For everyone</p>
        </Container>
    )
}
