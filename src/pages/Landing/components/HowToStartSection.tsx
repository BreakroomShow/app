import { Link } from '../../../components/Link'
import { LinkButton } from '../../../components/LinkButton'
import { SegmentComponent } from '../../../components/Segment'
import { Box, Column, Columns, Spacer, Stack, Text, styled } from '../../../design-system'
import { guides, phantomWalletUrl } from '../const'
import { PageContent } from './PageContent'
import { PageSpacer } from './PageSpacer'
import { SectionTitle } from './SectionTitle'

const Container = styled(Box, {
    position: 'relative',
    borderRadius: '$lg',

    paddingY: 124,
    '@down-md': { paddingY: 50 },

    background: '#ECE9E3',
    color: '$white',
})

const Segment = styled(SegmentComponent, {
    background: '$green',
    '@xl': { height: 570 },
    paddingY: 60,
    paddingX: 10,
    flexDirection: 'column',
    alignItems: 'center',
})

export function HowToStartSection() {
    const steps = [
        {
            color: 'green',
            guideUrl: guides.installWallet,
            title: 'Get a crypto wallet\non the Solana',
            description: (
                <span>
                    It’s very simple. Download
                    <br />
                    <Link to={phantomWalletUrl} target="_blank" rel="noreferrer" underline>
                        Phantom Wallet
                    </Link>
                </span>
            ),
        },
        {
            color: 'orange',
            guideUrl: guides.connectWallet,
            title: 'Sign-in to our website\nusing your wallet',
            description:
                'On-chain apps are accessed through\nwallets, not emails and passwords.\nDon’t worry, it’s safe',
        },
        {
            color: 'blue',
            guideUrl: guides.depositWallet,
            title: 'Add half a dollar on\nyour wallet',
            description: 'Participation in each trivia costs\n$0,01. Because the game is built\non a blockchain',
        },
    ]

    return (
        <Container>
            <PageContent>
                <SectionTitle>How To Start</SectionTitle>
                <PageSpacer />
                <Columns collapseBelow="@down-xl">
                    {steps.map((i) => (
                        <Column key={i.color}>
                            <Segment css={{ background: `$${i.color}` }} variant="pill">
                                <Spacer size={{ '@initial': 'xl', '@down-xl': 'md' }} />
                                <Spacer size={{ '@initial': 'xl', '@down-xl': 'md' }} />
                                <Stack space="sm">
                                    <Text font="body" size="lg" preserveLinebreaks align="center">
                                        {i.title}
                                    </Text>
                                    <Text font="body" color="whiteA" size="md" preserveLinebreaks align="center">
                                        {i.description}
                                    </Text>
                                </Stack>
                                <Spacer size={{ '@initial': 'bleed', '@down-xl': 'md' }} />
                                <LinkButton to={i.guideUrl}>video guide</LinkButton>
                            </Segment>
                        </Column>
                    ))}
                </Columns>
            </PageContent>
        </Container>
    )
}
