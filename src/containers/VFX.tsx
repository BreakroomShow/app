import Canvas from '../components/VFX/components/Canvas'
import SceneViewer from '../components/VFX/components/SceneViewer'
import SpaceDust from '../components/VFX/components/SpaceDust'
import { Stars, StarsProps } from '../components/VFX/Stars'
import { Box } from '../design-system'
import { GameEvent } from '../types'

interface VFXProps extends Pick<StarsProps, 'isPlaying' | 'speed'> {
    event: GameEvent | null
}

export const VFX = ({ event, isPlaying, speed }: VFXProps) => (
    <Box style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
        <Canvas>
            <SceneViewer event={event} />
            <SpaceDust count={1000} />
            <Stars isPlaying={isPlaying} speed={speed} count={300} />
        </Canvas>
    </Box>
)
