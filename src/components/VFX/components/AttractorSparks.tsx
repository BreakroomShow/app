import { useFrame } from '@react-three/fiber'
// @ts-ignore
import { mapRange } from 'canvas-sketch-util/math'
import { useMemo, useRef } from 'react'
import { CatmullRomCurve3, Vector3 } from 'three'

import { randomFloat, selectRandom } from '../../../utils/selectRandom'
import { MeshLineRef } from '../extend'
import { colors as colorsOG } from '../helpers/constants'

const radiusVariance = () => randomFloat(0.2, 1)

const generateCurve = (radius: number) => {
    const pos = new Vector3(-radius * 4, (-radius / 2) * radiusVariance(), 0)
    const points = new Array(30).fill(0).map((_el, idx) => {
        const angle = (idx / 20) * Math.PI * 2
        return pos
            .add(
                new Vector3(
                    Math.sin(angle) * radius * radiusVariance(),
                    Math.cos(angle) * radius * radiusVariance(),
                    // 1,
                    // 1,
                    0,
                ),
            )
            .clone()
    })
    return new CatmullRomCurve3(points).getPoints(300)
}

const generateLines = (colors: string[], count: number, radius: number) =>
    new Array(count).fill(0).map((_, index) => ({
        color: selectRandom(colors),
        width: Math.max(0.1, (0.2 * index) / 25),
        speed: Math.max(0.001, 0.004 * Math.random()) * 1.5,
        curve: generateCurve(radius),
    }))

interface FatlineProps {
    curve: Vector3[]
    width: number
    color: string
    speed: number
}

const FatLine = ({ curve, width, color, speed }: FatlineProps) => {
    const material = useRef<MeshLineRef>()

    useFrame(() => {
        if (material.current && material.current.uniforms) {
            material.current.uniforms.dashOffset.value -= speed
            material.current.uniforms.lineWidth.value = width * mapRange(0.4, 0.2, 0.4, 0.1, 2, true)
        }
    })

    return (
        <mesh>
            <meshLine attach="geometry" points={curve} />
            <meshLineMaterial
                attach="material"
                ref={material}
                transparent
                depthTest={false}
                lineWidth={width}
                color={color}
                // @ts-ignore
                dashArray={0.4}
                dashRatio={0.95}
            />
        </mesh>
    )
}

interface SparksProps {
    count?: number
    colors?: string[]
    radius?: number
}

export const Sparks = ({ count = 50, colors = colorsOG.sparks, radius = 1 }: SparksProps) => {
    const lines = useMemo(() => generateLines(colors, count, radius), [colors, count, radius])

    return (
        <group scale={1}>
            {lines.map((props, index) => (
                <FatLine key={index} {...props} />
            ))}
        </group>
    )
}
