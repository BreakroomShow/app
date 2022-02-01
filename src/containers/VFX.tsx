import { Canvas } from '@react-three/fiber'

import { Stars, StarsProps } from '../components/VFX/Stars'
import { Box } from '../design-system'
import { GameEvent } from '../types'

interface VFXProps extends Pick<StarsProps, 'isPlaying' | 'speed'> {
    event: GameEvent | null
}

export const VFX = ({ event, isPlaying, speed }: VFXProps) => {
    return (
        <Box style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
            <Canvas>
                <Stars isPlaying={isPlaying} speed={speed} count={300} />
            </Canvas>
        </Box>
    )
}
