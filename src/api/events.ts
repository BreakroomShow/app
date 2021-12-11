import * as trivia from 'clic-trivia'
import { useEffect } from 'react'

import { useGetLatest } from '../hooks/useGetLatest'
import { useProgram } from './query'

type EventMap = {
    EditGameEvent: trivia.EditGameEvent
    RevealQuestionEvent: trivia.RevealQuestionEvent
    RevealAnswerEvent: trivia.RevealAnswerEvent
}

export function useEventListener<Event extends keyof EventMap>(
    event: Event,
    listener: (message: EventMap[Event]) => void,
) {
    const [program] = useProgram()

    const callback = useGetLatest(listener)

    useEffect(() => {
        if (!program) return

        const listenerId = program.addEventListener(event, callback)

        return () => {
            program
                .removeEventListener(listenerId)
                .catch((RemoveEventListenerError) => console.error({ RemoveEventListenerError }))
        }
    }, [callback, event, program])
}
