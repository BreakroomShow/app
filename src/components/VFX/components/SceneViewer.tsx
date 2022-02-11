import { Sphere } from '@react-three/drei'
import { useState } from 'react'

import useUpdateEffect from '../../../hooks/useUpdateEffect'
import { GameEvent } from '../../../types'
import { Splash } from '../scenes/Splash'
import { AnimatePresence } from './AnimatePresence'

const scenes = {
    game_info_splash: <Splash />,
    question: null,
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
        <AnimatePresence id={key} handleExitFinished={handleExitFinished} isVisible={isVisible}>
            {scene}
        </AnimatePresence>
    )
}

export default SceneViewer
