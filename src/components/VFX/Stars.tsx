import { Point, Points } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import Random from 'canvas-sketch-util/random'
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

    const dpr = useThree(({ viewport }) => viewport.dpr)

    const pointsArray = useMemo(
        () =>
            Array.from({ length: count }, () => {
                const radius = (Math.random() - 0.5) * depth
                const [x, z] = Random.onCircle(radius)
                const y = Math.abs(radius) * Math.tan((37.5 * Math.PI) / 180)
                return {
                    position: new Vector3(x, y * (Math.random() - 0.5) * 2, z),
                    scale: Math.random(),
                    color: color ?? new Color(selectRandom(colors.trivia)),
                }
            }),
        [color, count, depth],
    )

    useFrame((state, delta) => {
        if (!isPlaying) return
        if (!shaderRef.current || !particlesRef.current) return

        const coef = 0.01 * speed

        particlesRef.current.rotation.y = state.clock.getElapsedTime() * -coef
        shaderRef.current.uTime += delta * coef
    })

    return (
        <Suspense fallback={null}>
            {/* @ts-ignore */}
            <Points ref={particlesRef} limit={count}>
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
