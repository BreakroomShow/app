import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Vector3 } from 'three'

import { useReplay } from '../../../pages/Landing/useReplay'
import { randomFloat, selectRandom } from '../../../utils/selectRandom'
import { MeshLineRef } from '../extend'
import {
    Attractor,
    aizawaAttractor,
    arneodoAttractor,
    createAttractor,
    dadrasAttractor,
    dequanAttractor,
    lorenzAttractor,
    lorenzMod2Attractor,
    updateAttractor,
} from '../helpers/attractor'
import { colors as ogColors } from '../helpers/constants'

const randomSimulation = () =>
    selectRandom([
        dadrasAttractor,
        aizawaAttractor,
        arneodoAttractor,
        dequanAttractor,
        lorenzAttractor,
        lorenzMod2Attractor,
    ])

interface FatlineProps {
    radius: number
    simulation: Attractor
    width: number
    color: string
    points: Vector3[]
    currentPosition: Vector3
}

function Fatline({ radius, simulation, width, color, points, currentPosition }: FatlineProps) {
    const { isPlaying } = useReplay()

    const line = useRef<MeshLineRef>()

    useFrame(() => {
        if (!isPlaying) return

        if (line.current) {
            const nextPosition = updateAttractor(currentPosition, radius, simulation, 0.005)
            line.current.advance(nextPosition)
        }
    })

    return (
        <mesh>
            <meshLine ref={line} attach="geometry" points={points} />
            <meshLineMaterial attach="material" transparent lineWidth={width} color={color} />
        </mesh>
    )
}

interface SparkStormProps {
    count?: number
    colors?: string[]
    radius?: number
    range?: [number, number]
}

export function SparkStorm({
    count = 500,
    colors = ogColors.trivia,
    radius = 1,
    range = [0.01, 0.52],
}: SparkStormProps) {
    const lines = useMemo(
        () =>
            new Array(count).fill(null).map(() => {
                const [points, currentPosition] = createAttractor(10)
                return {
                    color: selectRandom(colors),
                    width: randomFloat(...range),
                    speed: randomFloat(0.001, 0.002),
                    simulation: randomSimulation(),
                    radius: randomFloat(2, 2.25) * radius,
                    points,
                    currentPosition,
                }
            }),
        [count, colors, range, radius],
    )

    return (
        <group>
            {lines.map((props, index) => (
                <Fatline key={index} {...props} />
            ))}
        </group>
    )
}
