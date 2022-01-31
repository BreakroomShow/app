import { Canvas } from '@react-three/fiber'

import Stars from '../components/VFX/Stars'
import { GameEvent } from '../types'

interface VFXProps {
    event: GameEvent | null
    isPlaying: boolean
}

export const VFX = ({ event, isPlaying }: VFXProps) => {
    return (
        <Canvas>
            <Stars count={300} />
        </Canvas>
    )
}
