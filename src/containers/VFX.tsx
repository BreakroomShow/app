import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'

import { Stars, StarsProps } from '../components/VFX/Stars'
import { Box } from '../design-system'
import { GameEvent } from '../types'

interface VFXProps extends Pick<StarsProps, 'isPlaying' | 'speed'> {
    event: GameEvent | null
}

export const VFX = ({ event, isPlaying, speed }: VFXProps) => {
    const [dpr, setDpr] = useState(1)
    useEffect(() => setDpr(window.devicePixelRatio), [])
    return (
        <Box style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
            <Canvas
                gl={{
                    stencil: false,
                    alpha: false,
                    antialias: true,
                    preserveDrawingBuffer: true,
                }}
                dpr={dpr}
                flat
                onCreated={({ gl }) => gl.setClearColor('#020207')}
            >
                <Stars isPlaying={isPlaying} speed={speed} count={300} />
            </Canvas>
        </Box>
    )
}
