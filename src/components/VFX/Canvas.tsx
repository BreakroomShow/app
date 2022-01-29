import { Canvas } from '@react-three/fiber'

const AppCanvas = () => (
    <Canvas dpr={2} flat>
        <color attach="background" args={['#020207']} />
    </Canvas>
)

export default AppCanvas
