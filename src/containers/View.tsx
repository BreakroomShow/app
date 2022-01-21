import { ReactNode } from 'react'

import { ChatSegment, SEGMENT_WIDTH, SegmentContainer } from '../components/Segment'
import { Box, Inset, Typography, styled } from '../design-system'

const Container = styled(Box, {
    marginX: 'auto',

    display: 'flex',
    maxWidth: SEGMENT_WIDTH * 6,

    '@down-xl': {
        flexDirection: 'column',
        maxWidth: SEGMENT_WIDTH * 4,
    },
})

function Chat() {
    return (
        <Box
            css={{
                width: '100%',
                padding: '$xxl',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <Inset x="md" y="xl">
                <Typography as="h3" color="black">
                    Chat
                </Typography>
            </Inset>
            <Typography as="text1" color="black">
                здесь будет чат
            </Typography>
        </Box>
    )
}

export function View({ children }: { children: ReactNode }) {
    return (
        <Container>
            <SegmentContainer>{children}</SegmentContainer>
            <ChatSegment>
                <Chat />
            </ChatSegment>
        </Container>
    )
}
