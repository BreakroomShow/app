import { Canvas } from '@react-three/fiber'

import { Stars } from '../components/VFX/Stars'
import { Box } from '../design-system'
import { GameEvent } from '../types'

interface VFXProps {
    event: GameEvent | null
    isPlaying: boolean
}

export const VFX = ({ event, isPlaying }: VFXProps) => {
    return (
        <Box style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
            <Canvas>
                <Stars count={300} />
            </Canvas>
        </Box>
    )
}
