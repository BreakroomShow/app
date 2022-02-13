import { useTexture } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Mesh, Vector3 } from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

import matcap from '../assets/matcap_texture.png'

const defaultConfig = {
    size: 5,
    height: 1.25,
    curveSegments: 32,
    bevelEnabled: true,
    bevelThickness: 0.3,
    bevelSize: 0.05,
    bevelOffset: 0,
    bevelSegments: 2,
}

export const Text = ({
    children = `Breakroom
      Show`,
    vAlign = 'center',
    hAlign = 'center',
    size = 1,
    config = defaultConfig,
    color = '',
    // matcap = '55C404_BCFA0E_97F004_7AE104',
    ...props
}) => {
    const font = useLoader(FontLoader, './fonts/Blacker.json')

    const mesh = useRef<Mesh>(null)
    const fontConfig = useMemo(
        () => ({
            font,
            ...config,
        }),
        [font, config],
    )

    useLayoutEffect(() => {
        if (mesh.current !== null) {
            const textSize = new Vector3()
            mesh.current.geometry.computeBoundingBox()
            if (mesh.current.geometry.boundingBox) {
                mesh.current.geometry.boundingBox.getSize(textSize)
                let [xPos, yPos] = [0, 0]

                if (hAlign === 'center') {
                    xPos = -textSize.x / 2
                } else if (hAlign !== 'right') {
                    xPos = -textSize.x
                }

                if (vAlign === 'center') {
                    yPos = -textSize.y / 2
                } else if (vAlign !== 'top') {
                    yPos = -textSize.y
                }

                mesh.current.position.x = xPos
                mesh.current.position.y = yPos
            }
        }
    }, [children, hAlign, vAlign])

    // const [matcapTex] = useMatcapTexture(matcap)
    const matcapTex = useTexture(matcap)

    return (
        <group scale={0.15 * 0.7 * size} {...props}>
            <mesh ref={mesh}>
                <textGeometry args={[children, fontConfig]} />
                {color ? <meshBasicMaterial color={color} /> : <meshMatcapMaterial matcap={matcapTex} />}
                {/* <meshBasicMaterial color={color} /> */}
            </mesh>
        </group>
    )
}
