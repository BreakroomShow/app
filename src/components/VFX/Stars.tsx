import { Point, Points } from '@react-three/drei'
import { ReactThreeFiber, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useMemo, useRef } from 'react'
import { AdditiveBlending, Color, ShaderMaterial, Vector3 } from 'three'

import { getRandomColor } from './helpers'
import { AnimatedGalaxyMaterial } from './shaders/AnimatedGalaxyMaterial'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            animatedGalaxyMaterial: ReactThreeFiber.MaterialNode<ShaderMaterial, []>
        }
    }
}

interface StarsProps {
    count?: number
    width?: number
    depth?: number
    height?: number
    size?: number
    fixed?: boolean
    color?: Color
}

export default function Stars({
    count = 40,
    // width = 40,
    depth = 40,
    // height = 40,
    size = 1000,
    fixed,
    color,
}: StarsProps) {
    const shaderRef = useRef<any>()
    const particlesRef = useRef(null!)

    //   const ref = useRef<Mesh>(null!)
    const { dpr, width, height } = useThree(({ viewport }) => viewport)

    const pointsArray = useMemo(
        () =>
            Array.from({ length: count }, (v, k) => ({
                position: new Vector3(
                    (Math.random() - 0.5) * depth,
                    (Math.random() - 0.5) * height * 2,
                    (Math.random() - 0.5) * width * 2,
                ),
                scale: Math.random(),
                color: color ?? new Color(getRandomColor()),
            })),
        [color, count, depth, height, width],
    )
    useFrame((_, delta) => {
        // particlesRef.current.rotation.y =
        //   state.clock.getElapsedTime() * rotationSpeed
        if (shaderRef.current && shaderRef.current.uTime && !fixed) shaderRef.current.uTime += delta / 2
    })

    return (
        <Suspense fallback={null}>
            <Points ref={particlesRef}>
                <animatedGalaxyMaterial
                    vertexColors
                    depthWrite={false}
                    blending={AdditiveBlending}
                    /* @ts-ignore */
                    uSize={size * dpr}
                    key={AnimatedGalaxyMaterial.key}
                    ref={shaderRef}
                />
                {pointsArray.map((el, i) => (
                    // @ts-ignore
                    <Point key={i} position={el.position} size={el.scale} color={el.color} />
                ))}
            </Points>
        </Suspense>
    )
}
