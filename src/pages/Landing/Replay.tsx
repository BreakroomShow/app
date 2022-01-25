import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { getReplay } from '../../api/methods'
import { GameManager } from '../../containers/GameManager'
import { Box, styled } from '../../design-system'
import { useGetLatest } from '../../hooks/useGetLatest'
import { useReplayState } from './useReplayBridge'

const Container = styled(Box, {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
            start(nextEvent.event.duration)
        }

        function start(durationSec: number) {
            timeout = window.setTimeout(run, (durationSec * 1000) /* TODO remove */ / 4)
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

    return <Container>{current ? <GameManager event={current.event} /> : null}</Container>
}
