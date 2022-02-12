import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { useReplayQuery } from '../../api/query'
import { SegmentContainer } from '../../components/Segment'
import { ChatView } from '../../containers/Chat'
import { ReplayManager } from '../../containers/ReplayManager'
import { VFX } from '../../containers/VFX'
import { View } from '../../containers/View'
import { Box, styled } from '../../design-system'
import {
    ChatMessage,
    GameEvent,
    GameFlowEvent,
    ReplayChatMessage,
    ReplayEvent,
    ViewerCountUpdateEvent,
} from '../../types'
import { findLastIndex } from '../../utils/findLastIndex'
import { sleep } from '../../utils/sleep'
import { ReplayContext } from './useReplay'
import { useReplayState } from './useReplayBridge'

const Container = styled(Box, {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    variants: {
        disableAnimation: {
            true: {
                '*': {
                    transition: 'none !important',
                    animation: 'none !important',
                },
            },
        },
    },
})

const PREVIEW_EVENT = 'answer_reveal'
const SPEED = 2.4

export function Replay() {
    const { data: replay, isSuccess } = useReplayQuery()

    const playedRef = useRef(false)
    const isPlaying = useReplayState(isSuccess)

    const { allEvents, gameFlowEvents, gameFinishedAt, allMessages } = useMemo(() => {
        const _allEvents: ReplayEvent<GameEvent>[] = (replay?.events || []).map((e) => ({
            ...e,
            event: { ...e.event, duration: e.event.duration ? e.event.duration / SPEED : e.event.duration },
        }))

        const _gameFlowEvents = _allEvents.filter(
            (e): e is ReplayEvent<GameFlowEvent> => e.event.type !== 'viewer_count_update',
        )

        return {
            gameFlowEvents: _gameFlowEvents,
            allEvents: _allEvents,
            gameFinishedAt: replay?.game_finished_at_timestamp || 0,
            gameStartedAt: replay?.game_started_at_timestamp || 0,
            allMessages: replay?.chat_messages || [],
        }
    }, [replay])

    const [currentEvent, setCurrentEvent] = useState<GameFlowEvent | null>(null)
    const [viewers, setViewers] = useState(0)
    const [messages, setMessages] = useState<ChatMessage[]>([])

    const previewEventIndex = allEvents.findIndex((e) => e.event.type === PREVIEW_EVENT) || null

    const gameTime = useRef<number | null>(null)
    const onPauseEventIndex = useRef(0)

    const messageQueue = useRef<{ queue: ReplayChatMessage[]; next?: ReplayChatMessage }>({ queue: [] })
    const resetMessageQueue = useCallback(() => {
        setMessages([])
        messageQueue.current.queue = [...allMessages]
        messageQueue.current.next = messageQueue.current.queue.shift()
    }, [allMessages])
    useEffect(() => resetMessageQueue(), [resetMessageQueue])

    useEffect(() => {
        if (playedRef.current || previewEventIndex == null) return

        const event = allEvents[previewEventIndex]

        if (!event) return

        setCurrentEvent(event.event as GameFlowEvent)

        const time = event.timestamp
        const currentViewersCountEvent = allEvents.find((e): e is ReplayEvent<ViewerCountUpdateEvent> => {
            return e.timestamp >= time && e.event.type === 'viewer_count_update'
        })
        if (currentViewersCountEvent) {
            setViewers(currentViewersCountEvent.event.viewer_count)
        }

        const currentMessageCount = findLastIndex(allMessages, (m) => m.timestamp <= time)

        setMessages(allMessages.slice(0, currentMessageCount).map((m) => m.message))
    }, [allEvents, allMessages, previewEventIndex])

    useEffect(() => {
        function checkMessages() {
            const message = messageQueue.current.next

            if (!message) return
            if (!gameTime.current) return
            if (gameTime.current < message.timestamp) return

            setMessages((prev) => [...prev, message.message])
            messageQueue.current.next = messageQueue.current.queue.shift()
        }

        const interval = setInterval(checkMessages, 500)

        return () => {
            clearInterval(interval)
        }
    }, [gameFinishedAt, resetMessageQueue])

    useLayoutEffect(() => {
        if (!isPlaying) return

        if (!playedRef.current) {
            playedRef.current = true

            const initialEvent =
                allEvents.find((e): e is ReplayEvent<GameFlowEvent> => e.event.type === 'game_info_splash')?.event ||
                null
            setCurrentEvent(initialEvent)
            setMessages([])
        }

        let isCurrent = true

        async function run() {
            const events = allEvents

            for (const [key, { event, timestamp }] of Object.entries(events)) {
                const index = Number(key)
                const isLast = index === events.length - 1

                if (index < onPauseEventIndex.current) {
                    continue
                }

                if (!isCurrent) return

                gameTime.current = timestamp

                if (event.type === 'viewer_count_update') {
                    setViewers(event.viewer_count)
                } else {
                    onPauseEventIndex.current = index

                    setCurrentEvent(event)
                }

                const nextEvent = events[index + 1]

                const duration =
                    ((nextEvent?.event.game_start_offset || gameFinishedAt) - event.game_start_offset) * 1000

                await sleep((duration /* to level the accuracy */ * 0.7) / SPEED)

                if (isLast) {
                    onPauseEventIndex.current = 0
                    resetMessageQueue()
                    run()
                }
            }
        }

        run()

        return () => {
            isCurrent = false
        }
    }, [allEvents, gameFinishedAt, isPlaying, resetMessageQueue])

    let currentQuestionText = ''

    if (currentEvent?.type === 'question') {
        currentQuestionText = currentEvent.question
    } else if (currentEvent?.type === 'answer_reveal') {
        currentQuestionText = currentEvent.question.question
    }

    let currentQuestionId = -1
    let totalQuestions = 0
    let userAnswerId = -1

    gameFlowEvents.forEach((event, index) => {
        if (event.event.type === 'question') {
            totalQuestions++

            if (event.event.question === currentQuestionText) {
                currentQuestionId = totalQuestions - 1

                const nextEvent = gameFlowEvents[index + 1]
                if (nextEvent?.event.type === 'answer_reveal') {
                    userAnswerId = nextEvent.event.correct_answer_ind
                }
            }
        }
    })

    const ctx = useMemo(() => ({ isPlaying, speed: SPEED }), [isPlaying])

    return (
        <ReplayContext.Provider value={ctx}>
            <VFX event={currentEvent} offset={500} />
            <Container disableAnimation={!isPlaying}>
                {currentEvent ? (
                    <View>
                        <SegmentContainer>
                            <ReplayManager
                                event={currentEvent}
                                currentQuestionId={currentQuestionId}
                                totalQuestions={totalQuestions}
                                userAnswerId={userAnswerId}
                            />
                        </SegmentContainer>
                        <ChatView viewers={viewers} messages={messages} scrollToBottom />
                    </View>
                ) : null}
            </Container>
        </ReplayContext.Provider>
    )
}
