import { Sphere } from '@react-three/drei'
import { useEffect, useState } from 'react'

import { AnimatePresence } from '../components/VFX/components/AnimatePresence'
import Canvas from '../components/VFX/components/Canvas'
import SceneViewer from '../components/VFX/components/SceneViewer'
import { Splash } from '../components/VFX/scenes/Splash'
import { Stars, StarsProps } from '../components/VFX/Stars'
import { Box } from '../design-system'
import useUpdateEffect from '../hooks/useUpdateEffect'
import { GameEvent } from '../types'

interface VFXProps extends Pick<StarsProps, 'isPlaying' | 'speed'> {
    event: GameEvent | null
}

export const VFX = ({ event, isPlaying, speed }: VFXProps) => {
    return (
        <Box style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
            <Canvas>
                <SceneViewer event={event} />
                <Stars isPlaying={isPlaying} speed={speed} count={300} />
            </Canvas>
        </Box>
    )
}
