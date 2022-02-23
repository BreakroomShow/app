import { Suspense, useState } from 'react'

import { GameEvent } from '../../../types'
import { GameInfoSplash } from '../scenes/GameInfoSplash'
import { QuestionFact } from '../scenes/QuestionFact'
import { Splash } from '../scenes/Splash'
import { AnimatePresence } from './AnimatePresence'

const scenes = {
    intro_splash: <Splash />,
    game_info_splash: <GameInfoSplash />,
    empty: null,
    question: null,
    answer_reveal: null,
    question_fact: <QuestionFact />,
    crypto_fact: null,
    viewer_count_update: null,
} as const

export const SceneViewer = ({ event, offset = 0 }: { offset?: number; event: GameEvent | null }) => {
    const nextScene = event?.type || ('empty' as const)
    const [scene, setScene] = useState(nextScene)

    return (
        <group position={[-offset / 250, 0, 0]}>
            <AnimatePresence id={scene} onExit={() => setScene(nextScene)} isVisible={nextScene === scene}>
                <Suspense fallback={null}>{scenes[scene]}</Suspense>
            </AnimatePresence>
        </group>
    )
}
