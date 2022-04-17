import { useContextBridge } from '@react-three/drei'
import { Canvas as OGCanvas } from '@react-three/fiber'
import { getGPUTier } from 'detect-gpu'
import { ReactNode, useEffect, useState } from 'react'

import { ReplayContext } from '../../../pages/Replay'

export const Canvas = ({ children }: { children: ReactNode }) => {
    const ContextBridge = useContextBridge(ReplayContext)
    const [capable, setCapable] = useState(false)
    useEffect(() => {
        const gpuTier = getGPUTier()
        gpuTier.then((_stats) => _stats.isMobile === false && setCapable(true))
    }, [])

    return (
        <OGCanvas
            dpr={capable ? Math.min(2, window.devicePixelRatio) : 1}
            gl={{
                stencil: false,
                alpha: false,
                antialias: true,
            }}
            flat
            onCreated={({ gl }) => gl.setClearColor('#020207')}
        >
            <ContextBridge>{children}</ContextBridge>
        </OGCanvas>
    )
}
