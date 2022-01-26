import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { getReplay } from '../../api/methods'
import { GameManager } from '../../containers/GameManager'
import { View } from '../../containers/View'
import { Box, styled } from '../../design-system'
import { useGetLatest } from '../../hooks/useGetLatest'
import { QuestionEvent, ReplayEvent } from '../../types'
import { selectRandom } from '../../utils/selectRandom'
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

export function Replay() {
    const { data: replay } = useQuery(['replay'], getReplay)
    const allEvents = replay?.events || []

    const [currentIndex, setCurrentIndex] = useState<number | null>(null)
    const current = (currentIndex != null && allEvents[currentIndex]) || null

    const getLatest = useGetLatest(() => ({
        currentEventIndex: currentIndex,
        currentEvent: current,
        events: allEvents,
    }))

    const playedRef = useRef(false)
    const isPlaying = useReplayState()

    const previewEventIndex = allEvents.findIndex((e) => e.event.type === PREVIEW_EVENT) || null

    useEffect(() => {
        if (playedRef.current || previewEventIndex == null) return

        setCurrentIndex(previewEventIndex)
    }, [previewEventIndex])

    useEffect(() => {
        let timeout: number

        function run() {
            const { events, currentEventIndex } = getLatest()

            const nextEventIndex = ((currentEventIndex || 0) + 1) % events.length
            const nextEvent = events[nextEventIndex]

            if (!nextEvent) return

            setCurrentIndex(nextEventIndex)

            const durationSec =
                nextEvent.event.type === 'question'
                    ? nextEvent.event.duration - selectRandom([1, 2, 3, 4, 5])
                    : nextEvent.event.duration

            start(durationSec)
        }

        function start(durationSec: number) {
            timeout = window.setTimeout(run, durationSec * 1000)
        }

        const { currentEvent } = getLatest()

        if (!currentEvent) return

        if (isPlaying) {
            if (!playedRef.current) {
                playedRef.current = true
                setCurrentIndex(0)
            }

            start(currentEvent.event.duration)
        }

        return () => {
            window.clearTimeout(timeout)
        }
    }, [getLatest, isPlaying])

    const allQuestionEvents = allEvents.filter((e): e is ReplayEvent<QuestionEvent> => e.event.type === 'question')

    const currentQuestion = allQuestionEvents.findIndex((e) => {
        let currentQuestionText = ''

        if (current?.event.type === 'question') {
            currentQuestionText = current.event.question
        }

        if (current?.event.type === 'answer_reveal') {
            currentQuestionText = current.event.question.question
        }

        return e.event.question === currentQuestionText
    })

    return (
        <Container disableAnimation={!isPlaying}>
            <View>
                {current ? (
                    <GameManager
                        event={current.event}
                        currentQuestionId={currentQuestion}
                        totalQuestions={allQuestionEvents.length}
                        isPlaying={isPlaying}
                    />
                ) : null}
            </View>
        </Container>
    )
}
