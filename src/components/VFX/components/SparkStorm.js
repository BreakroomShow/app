import { extend, useFrame, useThree } from '@react-three/fiber'
import PropTypes from 'prop-types'
import { useMemo, useRef } from 'react'

import { selectRandom } from '../../../utils/selectRandom'
import { colors as ogColors } from './../helpers/constants'
import {
    aizawaAttractor,
    arneodoAttractor,
    createAttractor,
    dadrasAttractor,
    dequanAttractor,
    lorenzAttractor,
    lorenzMod2Attractor,
    updateAttractor,
} from '../helpers/attractor'
import * as meshline from '../MeshLine'

extend(meshline)

export const randomFloat = (min, max) => {
    return Math.random() * (max - min + 1) + min
}

const simulation = () =>
    selectRandom([
        dadrasAttractor,
        aizawaAttractor,
        arneodoAttractor,
        dequanAttractor,
        lorenzAttractor,
        lorenzMod2Attractor,
    ])

function Fatline({ radius, simulation, width, color }) {
    const line = useRef()

    useFrame(() => {
        if (line.current) {
            const nextPosition = updateAttractor(currentPosition, radius, simulation, 0.005)

            line.current.advance(nextPosition)
        }
    })

    const [positions, currentPosition] = useMemo(() => createAttractor(5), [])

    return (
        <mesh>
            <meshLine ref={line} attach="geometry" points={positions} />
            <meshLineMaterial attach="material" transparent lineWidth={width} color={color} />
        </mesh>
    )
}

export function SparkStorm({ count = 500, colors = ogColors.trivia, radius = 10, range = [0.01, 0.02] }) {
    const lines = useMemo(
        () =>
            new Array(count)
                .fill()
                .map(() => ({
                    color: selectRandom(colors),
                    width: randomFloat(...range),
                    speed: randomFloat(0.001, 0.002),
                    simulation: simulation(),
                    radius: randomFloat(2, 2.25) * radius,
                })),
        [count, colors, radius, range],
    )

    const storm = useRef()

    const { size, viewport } = useThree()
    const aspect = size.width / viewport.width

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

SparkStorm.propTypes = {
    count: PropTypes.number.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
}
