import { ReactNode } from 'react'

import { SegmentComponent } from '../../../components/Segment'
import { Column, Columns, Stack, Text, Typography } from '../../../design-system'
import { useNonce } from '../../../hooks/useNonce'
import { msToTimeUntil } from '../../../utils/date'

const nextGameDate = new Date('March 15, 2022 19:00:00')

export function NextGameSection({ children }: { children: ReactNode }) {
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
        { color: 'blue', title: '$3000', description: 'in the prize fund' },
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
            {children}
        </>
    )
}
