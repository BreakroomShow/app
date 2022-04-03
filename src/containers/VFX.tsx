import '../components/VFX/extend'

import { ReactNode } from 'react'

import { Canvas } from '../components/VFX/components/Canvas'
import { SceneViewer } from '../components/VFX/components/SceneViewer'
// import { Stars } from '../components/VFX/Stars'
import { Box } from '../design-system'
import { GameEvent } from '../types'

interface VFXProps {
    event: GameEvent | null
    offset?: number
    children?: ReactNode
}

export const VFX = ({ event, offset, children }: VFXProps) => {
    return (
        <Box css={{ position: 'fixed', inset: 0, zIndex: -1 }}>
            <Canvas>
                {children}
                <SceneViewer event={event} offset={offset} />
                {/* <Stars /> */}
            </Canvas>
        </Box>
    )
}
