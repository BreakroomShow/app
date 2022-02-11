import { Sphere } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useState } from 'react'

import useUpdateEffect from '../../../hooks/useUpdateEffect'
import { GameEvent } from '../../../types'
import { Splash } from '../scenes/Splash'
import { AnimatePresence } from './AnimatePresence'

const scenes = {
    game_info_splash: <Splash />,
    question: <Splash />,
    answer_reveal: null,
    question_fact: null,
    crypto_fact: null,
}

const SceneViewer = ({ event }: { event: GameEvent | null }) => {
    const [scene, setScene] = useState(event && scenes ? scenes[event.type] : null)

    const [isVisible, setVisible] = useState(true)
    const [key, setKey] = useState(0)

    const updateScene = () => {
        setScene(event && scenes ? scenes[event.type] : null)
    }

    const viewport = useThree(({ viewport }) => viewport)

    useUpdateEffect(() => {
        if (scene) {
            setVisible(false)
        } else {
            setVisible(true)
            updateScene()
        }
    }, [event])

    const handleExitFinished = () => {
        updateScene()
        setVisible(true)
        setKey((key) => key + 1)
    }
    return (
        <group position={[-viewport.width / 7, 0, 0]}>
            <AnimatePresence id={key} handleExitFinished={handleExitFinished} isVisible={isVisible}>
                {scene}
            </AnimatePresence>
        </group>
    )
}

export default SceneViewer
