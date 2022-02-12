import { useContextBridge } from '@react-three/drei'
import { Canvas as OGCanvas } from '@react-three/fiber'
import { ReactNode } from 'react'

import { ReplayContext } from '../../../pages/Landing/useReplay'

export const Canvas = ({ children }: { children: ReactNode }) => {
    const ContextBridge = useContextBridge(ReplayContext)

    return (
        <OGCanvas
            dpr={window.devicePixelRatio}
            gl={{
                stencil: false,
                alpha: false,
                antialias: true,
                preserveDrawingBuffer: true,
            }}
            flat
            onCreated={({ gl }) => gl.setClearColor('#020207')}
        >
            <ContextBridge>{children}</ContextBridge>
        </OGCanvas>
    )
}
