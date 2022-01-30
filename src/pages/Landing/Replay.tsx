import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { getReplay } from '../../api/methods'
import { GameManager } from '../../containers/GameManager'
import { VFX } from '../../containers/VFX'
import { View } from '../../containers/View'
import { Box, styled } from '../../design-system'
import { useGetLatest } from '../../hooks/useGetLatest'
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
    const { data: replay, isSuccess } = useQuery(['replay'], getReplay)
    const allEvents = (replay?.events || []).map((e) => ({
        ...e,
        event: { ...e.event, duration: e.event.duration / SPEED },
    }))

    const [currentIndex, setCurrentIndex] = useState<number | null>(null)
    const current = (currentIndex != null && allEvents[currentIndex]) || null

    const getLatest = useGetLatest(() => ({
        currentEventIndex: currentIndex,
        currentEvent: current,
        events: allEvents,
    }))

    const playedRef = useRef(false)
    const isPlaying = useReplayState(isSuccess)

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

            start(nextEvent.event.duration)
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

    let currentQuestionText = ''

    if (current?.event.type === 'question') {
        currentQuestionText = current.event.question
    } else if (current?.event.type === 'answer_reveal') {
        currentQuestionText = current.event.question.question
    }

    let currentQuestionId = -1
    let totalQuestions = 0
    let userAnswerId = -1

    allEvents.forEach((event, index) => {
        if (event.event.type === 'question') {
            totalQuestions++

            if (event.event.question === currentQuestionText) {
                currentQuestionId = totalQuestions - 1

                const nextEvent = allEvents[index + 1]
                if (nextEvent?.event.type === 'answer_reveal') {
                    userAnswerId = nextEvent.event.correct_answer_ind
                }
            }
        }
    })

    return (
        <>
            <VFX event={current && current.event} isPlaying={isPlaying} />
            <Container disableAnimation={!isPlaying}>
                <View>
                    {current ? (
                        <GameManager
                            event={current.event}
                            currentQuestionId={currentQuestionId}
                            totalQuestions={totalQuestions}
                            userAnswerId={userAnswerId}
                            isPlaying={isPlaying}
                            speed={SPEED}
                        />
                    ) : null}
                </View>
            </Container>
        </>
    )
}
