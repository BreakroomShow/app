import { Point, Points } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { ComponentRef, Suspense, useMemo, useRef } from 'react'
import { AdditiveBlending, Color, Vector3 } from 'three'

import { useReplay } from '../../pages/Landing/useReplay'
import { selectRandom } from '../../utils/selectRandom'
import { AnimatedGalaxyMaterialRef } from './extend'
import { colors } from './helpers/constants'

export interface StarsProps {
    count?: number
    depth?: number
    size?: number
    color?: Color
}

export function Stars({ count = 40, depth = 10, size = 800, color }: StarsProps) {
    const { isPlaying, speed } = useReplay()

    const shaderRef = useRef<AnimatedGalaxyMaterialRef>(null)
    const particlesRef = useRef<ComponentRef<typeof Points>>(null)

    const { dpr, width, height } = useThree(({ viewport }) => viewport)

    const pointsArray = useMemo(
        () =>
            Array.from({ length: count }, () => ({
                position: new Vector3(
                    (Math.random() - 0.5) * depth,
                    (Math.random() - 0.5) * height * 2,
                    (Math.random() - 0.5) * width * 2,
                ),
                scale: Math.random(),
                color: color ?? new Color(selectRandom(colors.trivia)),
            })),
        [color, count, depth, height, width],
    )

    useFrame((state, delta) => {
        if (!isPlaying) return
        if (!shaderRef.current || !particlesRef.current) return

        const coef = 0.01 * speed

        particlesRef.current.rotation.x = state.clock.getElapsedTime() * coef
        particlesRef.current.rotation.y = state.clock.getElapsedTime() * -coef
        shaderRef.current.uTime += delta * coef
    })

    return (
        <Suspense fallback={null}>
            <Points ref={particlesRef}>
                <animatedGalaxyMaterial
                    vertexColors
                    depthWrite={false}
                    blending={AdditiveBlending}
                    uSize={size * dpr}
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
