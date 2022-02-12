import '../components/VFX/extend'

import { Canvas } from '../components/VFX/components/Canvas'
import { SceneViewer } from '../components/VFX/components/SceneViewer'
import { SpaceDust } from '../components/VFX/components/SpaceDust'
import { Stars } from '../components/VFX/Stars'
import { Box } from '../design-system'
import { GameEvent } from '../types'

interface VFXProps {
    event: GameEvent | null
    offset?: number
}

export const VFX = ({ event, offset }: VFXProps) => {
    return (
        <Box css={{ position: 'fixed', inset: 0, zIndex: -1 }}>
            <Canvas>
                <SceneViewer event={event} offset={offset} />
                <SpaceDust count={1000} />
                <Stars count={300} />
            </Canvas>
        </Box>
    )
}
