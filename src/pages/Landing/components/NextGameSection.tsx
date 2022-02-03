import { Link } from '../../../components/Link'
import { LinkButton } from '../../../components/LinkButton'
import { SegmentComponent } from '../../../components/Segment'
import { Column, Columns, Stack, Text, Typography } from '../../../design-system'
import { useNonce } from '../../../hooks/useNonce'
import { msToTimeUntil } from '../../../utils/date'

const nextGameDate = new Date(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).setHours(19, 0, 0))

interface NextGameSectionProps {
    participateUrl: string
}

export function NextGameSection({ participateUrl }: NextGameSectionProps) {
    useNonce()

    const nextGameDateString = nextGameDate.toLocaleString('default', { day: 'numeric', month: 'short' })
    const nextGameTimeString = nextGameDate.toLocaleString('default', {
        timeZoneName: 'short',
        minute: 'numeric',
        hour: 'numeric',
    })

    const info = [
        { color: 'green', title: nextGameDateString, description: nextGameTimeString },
        { color: 'orange', title: msToTimeUntil(nextGameDate.getTime()), description: 'until the next game' },
        { color: 'blue', title: '$560', description: 'in the prize fund' },
    ]

    return (
        <>
            <Columns collapseBelow="@down-md">
                {info.map((i) => (
                    <Column key={i.color} width={1 / 3}>
                        <SegmentComponent
                            inset="center"
                            variant="pill"
                            css={{
                                background: `$${i.color}`,
                                paddingX: 10,
                                minHeight: 244,
                                '@down-xl': { minHeight: 145 },
                            }}
                        >
                            <Stack align="center">
                                <Text
                                    font="heading"
                                    size={{ '@all': 'xxxl', '@down-xxl': 'xxl' }}
                                    color="white"
                                    align="center"
                                >
                                    {i.title}
                                </Text>
                                <Typography as="text1" color="whiteA" align="center">
                                    {i.description}
                                </Typography>
                            </Stack>
                        </SegmentComponent>
                    </Column>
                ))}
            </Columns>
            <Link to={participateUrl} css={{ borderRadius: '$pill' }}>
                <SegmentComponent
                    inset="center"
                    variant="pill"
                    css={{
                        background: '$brightGreen',
                        minHeight: 225,
                        '@down-md': { minHeight: 125 },
                    }}
                >
                    <LinkButton>Sign up for the game</LinkButton>
                </SegmentComponent>
            </Link>
        </>
    )
}
