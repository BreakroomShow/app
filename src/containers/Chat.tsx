import { SEGMENT_HEIGHT, SEGMENT_WIDTH, SegmentComponent } from '../components/Segment'
import { Box, Inset, Typography, styled } from '../design-system'

const ChatSegment = styled(SegmentComponent, {
    background: `$white`,
    minHeight: SEGMENT_HEIGHT * 1.5,
    minWidth: SEGMENT_WIDTH * 1.5,

    defaultVariants: {
        variant: 'round',
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

export function ChatView() {
    return (
        <ChatSegment>
            <Chat />
        </ChatSegment>
    )
}
