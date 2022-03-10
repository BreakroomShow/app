import { useLayoutEffect, useRef } from 'react'

import { Avatar } from '../../components/Avatar'
import { CountUp } from '../../components/CountUp'
import { InputForm } from '../../components/InputForm'
import { ScrollArea } from '../../components/ScrollArea'
import { SEGMENT_HEIGHT, SEGMENT_WIDTH, SegmentComponent } from '../../components/Segment'
import { Wallet } from '../../components/Wallet'
import { Box, Inline, Inset, Stack, Typography, styled } from '../../design-system'
import { ReactComponent as EyeIcon } from '../../images/eye.svg'
import { ChatMessage } from '../../types'

const ChatContainer = styled(Box, {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
})

const ChatSegment = styled(SegmentComponent, {
    background: `$white`,
    minHeight: SEGMENT_HEIGHT * 1.5,
    minWidth: SEGMENT_WIDTH * 1.5,

    defaultVariants: {
        variant: 'round',
    },
})

const MessagesContainer = styled(Box, {
    display: 'flex',
    flexGrow: '1',
    minHeight: 400,
    position: 'relative',

    '&:before, &:after': {
        content: '""',
        position: 'absolute',
        zIndex: 1,
        left: 0,
        right: 0,

        $$size: '25px',
        height: '$$size',
        boxShadow: 'inset 0px calc($$inverse * $$size) calc($$size / 2) calc($$size / -2) white',
    },

    '&:before': {
        $$inverse: '1',
        top: 0,
    },

    '&:after': {
        $$inverse: '-1',
        bottom: 0,
    },
})

const MessagesScroll = styled(ScrollArea, {
    position: 'absolute',
    inset: 0,
    paddingY: 20,
    color: '$black',

    '& > div': { height: '100%' },
})

const Messages = styled(Box, {
    minHeight: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    paddingX: 32,
})

const Message = styled(Box, {
    lineHeight: '$md',

    [`& ${Avatar}`]: {
        marginBottom: -6,
        marginRight: 8,
    },
})

const InputContainer = styled(Box, {
    paddingX: 28,
    paddingBottom: 24,
})

interface ChatProps {
    viewers: number | null
    messages: ChatMessage[]
    scrollToBottom?: boolean
}

function Chat({ viewers, messages, scrollToBottom }: ChatProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const hasMessages = scrollToBottom ? messages.length : !!messages.length

    useLayoutEffect(() => {
        if (!hasMessages || !scrollRef.current) return

        scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight)
    }, [hasMessages])

    return (
        <ChatContainer>
            <Box css={{ paddingX: 40, paddingTop: 44 }}>
                <Inline space="xs">
                    <Inset bottom={{ custom: 6 }}>
                        <Typography as="h3" color="black">
                            Chat
                        </Typography>
                    </Inset>
                    {viewers != null ? (
                        <Box title="viewers">
                            <Inline space="xxs">
                                <EyeIcon />
                                <Inset bottom={{ custom: 2 }}>
                                    <Typography as="text2" color="greyA">
                                        <CountUp duration={1}>{viewers}</CountUp>
                                    </Typography>
                                </Inset>
                            </Inline>
                        </Box>
                    ) : null}
                </Inline>
            </Box>
            <MessagesContainer>
                <MessagesScroll ref={scrollRef}>
                    <Messages>
                        <Stack space="sm">
                            {messages.map((m) => (
                                <Message key={m.id}>
                                    <Typography color="black" as="body2" lineHeight="inherit">
                                        {/* <Avatar */}
                                        {/*     size="sm" */}
                                        {/*     src="https://solpunks.com/wp-content/uploads/2021/05/shadow-beard.png" */}
                                        {/* /> */}
                                        <Wallet size={4}>{m.from_id}</Wallet>{' '}
                                        <Typography color="greyA" as="body2">
                                            {m.text}
                                        </Typography>
                                    </Typography>
                                </Message>
                            ))}
                        </Stack>
                    </Messages>
                </MessagesScroll>
            </MessagesContainer>
            <InputContainer>
                <InputForm
                    placeholder="Message..."
                    onSubmit={(message, reset) => {
                        // TODO send message
                        reset()
                    }}
                />
            </InputContainer>
        </ChatContainer>
    )
}

export function ChatView(props: ChatProps) {
    return (
        <ChatSegment>
            <Chat {...props} />
        </ChatSegment>
    )
}
