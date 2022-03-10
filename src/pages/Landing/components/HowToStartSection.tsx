import { ReactNode } from 'react'

import { Link } from '../../../components/Link'
import { LinkButton } from '../../../components/LinkButton'
import { SegmentComponent } from '../../../components/Segment'
import { urls } from '../../../config'
import { Box, Column, Columns, Spacer, Stack, Text, styled } from '../../../design-system'
import { ReactComponent as Illustration1 } from '../../../images/illustration-1.svg'
import { ReactComponent as Illustration2 } from '../../../images/illustration-2.svg'
import { ReactComponent as Illustration3 } from '../../../images/illustration-3.svg'
import { PageBlock } from './PageBlock'
import { PageContent } from './PageContent'
import { SectionTitle } from './SectionTitle'

const Segment = styled(SegmentComponent, {
    background: '$green',
    '@xl': { height: 570 },
    paddingY: 60,
    paddingX: 10,
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'visible',
})

const Illustration = styled(Box, {
    height: 200,
    '@down-xl': {
        height: 140,
    },

    display: 'flex',
    alignItems: 'flex-end',

    '& > svg': {
        maxWidth: '100%',
        maxHeight: '180%',
    },

    pointerEvents: 'none',
})

export function HowToStartSection({ children }: { children: ReactNode }) {
    const steps = [
        {
            color: 'green',
            illustration: <Illustration1 />,
            guideUrl: urls.guides.installWallet,
            title: 'Get a crypto wallet\non the Solana',
            description: (
                <span>
                    It’s very simple. Download
                    <br />
                    <Link to={urls.external.phantom} target="_blank" rel="noreferrer" underline>
                        Phantom Wallet
                    </Link>
                </span>
            ),
        },
        {
            color: 'orange',
            illustration: <Illustration2 />,
            guideUrl: urls.guides.connectWallet,
            title: 'Sign-in to our website\nusing your wallet',
            description: 'On-chain apps are accessed through\nwallets, not emails and passwords.',
        },
        {
            color: 'blue',
            illustration: <Illustration3 />,
            guideUrl: null,
            title: 'Play and get a crypto\non your wallet',
            description: `Join the game at the scheduled\ntime, answer all the questions\nand get the prize`,
        },
    ]

    return (
        <PageBlock variant="dark">
            <PageContent>
                <Stack align="center" space="md">
                    <SectionTitle color="white">Real Transactions, but Free to Play</SectionTitle>
                    <Text font="body" size="md" color="whiteA" align="center" preserveLinebreaks>
                        Usually, projects that are built on blockchain require you to spend &quot;gas fees&quot; to
                        play.{'\n'}But not with us. We pay gas fees for you.{' '}
                        <Link to={urls.external.octane} underline wrap="nowrap">
                            How it&apos;s possible?
                        </Link>
                    </Text>
                </Stack>
                <Spacer size="xl" />
                <Columns collapseBelow="@down-xl">
                    {steps.map((i) => (
                        <Column key={i.color}>
                            <Segment css={{ background: `$${i.color}` }} variant="pill">
                                <Illustration>{i.illustration}</Illustration>
                                <Spacer size="lg" />
                                <Stack space="sm">
                                    <Text font="body" size="lg" preserveLinebreaks align="center">
                                        {i.title}
                                    </Text>
                                    <Text font="body" color="whiteA" size="md" preserveLinebreaks align="center">
                                        {i.description}
                                    </Text>
                                </Stack>
                                <Spacer size={{ '@initial': 'bleed', '@down-xl': 'md' }} />
                                {i.guideUrl ? <LinkButton to={i.guideUrl}>video guide</LinkButton> : null}
                            </Segment>
                        </Column>
                    ))}
                </Columns>
                {children}
            </PageContent>
        </PageBlock>
    )
}
