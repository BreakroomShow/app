import { ReactNode, Suspense, useEffect, useState } from 'react'

import { CryptoFactEvent, GameEvent } from '../../../types'
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
    crypto_fact: (event) => <Tips event={event as CryptoFactEvent} />,
    viewer_count_update: () => null,
}

export const SceneViewer = ({ event: nextEvent, offset = 0 }: { offset?: number; event: GameEvent | null }) => {
    const nextScene = nextEvent?.type
    const [[scene, event], setScene] = useState([nextScene, nextEvent])

    useEffect(() => {
        if (event && nextEvent)
            if (event.type === 'crypto_fact' && event.type === nextEvent.type)
                if (event.text !== nextEvent.text) setScene([scene, nextEvent])
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (!event && nextEvent) setScene([nextScene, nextEvent])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nextEvent])

    if (!scene || !event) return null

    return (
        <group position={[-offset / 250, 0, 0]}>
            <AnimatePresence id={scene} onExit={() => setScene([nextScene, nextEvent])} isVisible={nextScene === scene}>
                <Suspense fallback={null}>{scenes[scene](event)}</Suspense>
            </AnimatePresence>
        </group>
    )
}
