import { Canvas } from '@react-three/fiber'

export const AppCanvas = () => (
    <Canvas dpr={2} flat>
        <color attach="background" args={['#020207']} />
    </Canvas>
)
