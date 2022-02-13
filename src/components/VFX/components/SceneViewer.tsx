import { useState } from 'react'

import { GameEvent } from '../../../types'
import { Splash } from '../scenes/Splash'
import { AnimatePresence } from './AnimatePresence'

const scenes = {
    empty: null,
    game_info_splash: <Splash />,
    question: null,
    answer_reveal: null,
    question_fact: null,
    crypto_fact: null,
    viewer_count_update: null,
} as const

export const SceneViewer = ({ event, offset = 0 }: { offset?: number; event: GameEvent | null }) => {
    const nextScene = event?.type || ('empty' as const)
    const [scene, setScene] = useState(nextScene)

    return (
        <group position={[-offset / 250, 0, 0]}>
            <AnimatePresence id={scene} onExit={() => setScene(nextScene)} isVisible={nextScene === scene}>
                {scenes[scene]}
            </AnimatePresence>
        </group>
    )
}
