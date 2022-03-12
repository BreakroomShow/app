import { ReactNode, Suspense, useEffect, useState } from 'react'

import { GameEvent } from '../../../types'
import { GameInfoSplash } from '../scenes/GameInfoSplash'
import { QuestionFact } from '../scenes/QuestionFact'
import { Splash } from '../scenes/Splash'
import { Tips } from '../scenes/Tips'
import { AnimatePresence } from './AnimatePresence'

const scenes: Record<GameEvent['type'], (e: GameEvent) => ReactNode> = {
    intro_splash: () => <Splash />,
    game_info_splash: (event) => <GameInfoSplash event={event} />,
    question: () => null,
    answer_reveal: () => null,
    question_fact: (event) => <QuestionFact event={event} />,
    crypto_fact: (event) => <Tips event={event} />,
    viewer_count_update: () => null,
}

export const SceneViewer = ({ event: nextEvent, offset = 0 }: { offset?: number; event: GameEvent | null }) => {
    const nextScene = nextEvent?.type
    const [[scene, event], setScene] = useState([nextScene, nextEvent])

    useEffect(() => {
        if (nextEvent?.type === event?.type) {
            setScene([nextScene, nextEvent])
        }
    }, [event?.type, nextEvent, nextScene])

    if (!scene || !event) return null

    return (
        <group position={[-offset / 250, 0, 0]}>
            <AnimatePresence id={scene} onExit={() => setScene([nextScene, nextEvent])} isVisible={nextScene === scene}>
                <Suspense fallback={null}>{scenes[scene](event)}</Suspense>
            </AnimatePresence>
        </group>
    )
}
