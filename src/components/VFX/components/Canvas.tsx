import { Canvas as OGCanvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'

const Canvas = ({ children }: { children: any }) => {
    const [dpr, setDpr] = useState(1)
    useEffect(() => setDpr(window.devicePixelRatio), [])
    return (
        <OGCanvas
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
            {children}
        </OGCanvas>
    )
}

export default Canvas
