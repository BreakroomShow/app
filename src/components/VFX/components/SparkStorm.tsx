import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'

import { useReplay } from '../../../pages/Landing/useReplay'
import { selectRandom } from '../../../utils/selectRandom'
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

export const randomFloat = (min: number, max: number) => {
    return Math.random() * (max - min + 1) + min
}

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
}

function Fatline({ radius, simulation, width, color }: FatlineProps) {
    const { isPlaying } = useReplay()

    const line = useRef<MeshLineRef>()

    const [positions, currentPosition] = useMemo(() => createAttractor(5), [])

    useFrame(() => {
        if (!isPlaying) return

        if (line.current) {
            const nextPosition = updateAttractor(currentPosition, radius, simulation, 0.005)

            line.current.advance(nextPosition)
        }
    })

    return (
        <mesh>
            <meshLine ref={line} attach="geometry" points={positions} />
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
    radius = 10,
    range = [0.01, 0.02],
}: SparkStormProps) {
    const lines = useMemo(() => {
        return new Array(count).fill(null).map(() => ({
            color: selectRandom(colors),
            width: randomFloat(...range),
            speed: randomFloat(0.001, 0.002),
            simulation: randomSimulation(),
            radius: randomFloat(2, 2.25) * radius,
        }))
    }, [count, colors, range, radius])

    const storm = useRef()

    // const { size, viewport } = useThree()
    // const aspect = size.width / viewport.width

    useFrame(() => {
        // if (storm.current) {
        //   storm.current.rotation.x = lerp(
        //     storm.current.rotation.x,
        //     0 + mouse.current[1] / aspect / 200,
        //     0.1
        //   );
        //   storm.current.rotation.y = lerp(
        //     storm.current.rotation.y,
        //     0 + mouse.current[0] / aspect / 400,
        //     0.1
        //   );
        // }
    })

    return (
        <group ref={storm}>
            <group>
                {lines.map((props, index) => (
                    <Fatline key={index} {...props} />
                ))}
            </group>
        </group>
    )
}
