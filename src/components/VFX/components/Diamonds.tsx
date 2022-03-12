import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Color, DoubleSide, InstancedMesh, Object3D } from 'three'

import { selectRandom } from '../../../utils/selectRandom'
import { colors } from '../helpers/constants'

export const Diamonds = () => {
    const model = useRef<InstancedMesh>(null)
    const { nodes } = useGLTF('/assets/ruby.gltf')

    const dummy = useMemo(() => new Object3D(), [])

    const { clock, viewport } = useThree()
    const [viewportWidth] = useState(() => viewport.width)

    const diamonds = useMemo(
        () =>
            new Array(80).fill({}).map((_, i) => ({
                position: [
                    i < 5 ? 0 : viewportWidth / 2 - Math.random() * viewportWidth,
                    40 - Math.random() * 40,
                    i < 5 ? 26 : 10 - Math.random() * 20,
                ] as [number, number, number],
                factor: 0.1 + Math.random(),
                direction: Math.random() < 0.5 ? -1 : 1,
                rotation: [
                    Math.sin(Math.random()) * Math.PI,
                    Math.sin(Math.random()) * Math.PI,
                    Math.cos(Math.random()) * Math.PI,
                ] as const,
            })),
        [viewportWidth],
    )

    useEffect(() => {
        if (model.current) {
            diamonds.map((_, i) =>
                model.current!.setColorAt(i, new Color(selectRandom(colors.trivia)).convertSRGBToLinear()),
            )
        }
    }, [diamonds])

    useFrame(() => {
        diamonds.forEach((data, i) => {
            const t = clock.getElapsedTime()
            data.position[1] -= (data.factor / 5) * data.direction
            if (
                data.position[1] &&
                data.position[2] &&
                (data.direction === 1 ? data.position[1] < -50 : data.position[1] > 50)
            ) {
                data.position = [
                    i < 5 ? 0 : viewport.width / 2 - Math.random() * viewport.width,
                    50 * data.direction,
                    data.position[2],
                ]
            }
            const { position, rotation, factor } = data
            dummy.position.set(position[0], position[1], position[2])
            dummy.rotation.set(rotation[0] + t * factor, rotation[1] + t * factor, rotation[2] + t * factor)
            dummy.scale.set(1 + factor, 1 + factor, 1 + factor)
            dummy.updateMatrix()
            model.current?.setMatrixAt(i, dummy.matrix)
        })
        if (model.current) model.current.instanceMatrix.needsUpdate = true
    })

    return (
        /* @ts-ignore */
        <instancedMesh ref={model} args={[nodes?.Ruby?.geometry, null, diamonds.length]}>
            <meshBasicMaterial side={DoubleSide} />
        </instancedMesh>
    )
}
