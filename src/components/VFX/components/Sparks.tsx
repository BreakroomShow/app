import { useFrame } from '@react-three/fiber'
// @ts-ignore
// import { mapRange } from 'canvas-sketch-util/math'
import { useMemo, useRef } from 'react'
// import { BufferGeometry, CatmullRomCurve3, LineBasicMaterial, LineLoop, Vector3 } from 'three'
import { CatmullRomCurve3, Vector3 } from 'three'

import { randomFloat, selectRandom } from '../../../utils/selectRandom'
import { MeshLineRef } from '../extend'
import { colors as colorsOG } from '../helpers/constants'

const radiusVariance = () => randomFloat(0.2, 1)

const generateCurve = (radius: number) => {
    var startAngle = Math.random() * Math.PI * 2

    const points = new Array(30).fill(0).map((_el, idx) => {
        const angle = startAngle + (idx / 20) * Math.PI * 2
        return new Vector3(Math.cos(angle) * radius * radiusVariance(), Math.sin(angle) * radius * radiusVariance(), 0)
    })
    return new CatmullRomCurve3(points).getPoints(300)
}

const generateLines = (colors: string[], count: number, radius: number) =>
    new Array(count).fill(0).map((_, index) => ({
        color: selectRandom(colors),
        width: Math.max(0.1, (0.2 * index) / 15),
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
            // material.current.uniforms.lineWidth.value = width * mapRange(0.4, 0.2, 0.4, 0.1, 2, true)
        }
    })

    // const line = new LineLoop(new BufferGeometry().setFromPoints(curve), new LineBasicMaterial({ color: 0x00ff00 }))

    return (
        <>
            {/* <primitive object={line} /> */}
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
                    dashArray={0.9}
                    // dashArray={0}
                    dashRatio={0.95}
                />
            </mesh>
        </>
    )
}

interface SparksProps {
    count?: number
    colors?: string[]
    radius?: number
}

export const Sparks = ({ count = 50, colors = colorsOG.sparks, radius = 3.4 }: SparksProps) => {
    const lines = useMemo(() => generateLines(colors, count, radius), [colors, count, radius])

    return lines.map((props, index) => <FatLine key={index} {...props} />)
}
