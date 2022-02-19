import { useTexture } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Mesh, Vector3 } from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

import matcap from '../assets/matcap_texture.png'

const defaultConfig = {
    size: 0.5,
    height: 0.125,
    curveSegments: 32,
    bevelThickness: 0.03,
    bevelSize: 0.005,
    bevelEnabled: true,
    bevelOffset: 0,
    bevelSegments: 2,
}

export const Text = ({
    children = `Breakroom`,
    vAlign = 'center',
    hAlign = 'center',
    size = 1,
    config = defaultConfig,
    color = '',
    dontAlign = false,
    ...props
}) => {
    const font = useLoader(FontLoader, './fonts/Blacker.json')

    const mesh = useRef<Mesh>(null)

    const fontConfig = useMemo(
        () => ({
            font,
            ...config,
            size: config.size * size,
            height: config.height * size,
            curveSegments: config.curveSegments * size,
            bevelThickness: config.bevelThickness * size,
            bevelSize: config.bevelSize * size,
        }),
        [font, config, size],
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
    }, [children, dontAlign, hAlign, vAlign])

    const matcapTex = useTexture(matcap)

    return (
        <group {...props}>
            <mesh ref={mesh}>
                <textGeometry args={[children, fontConfig]} />
                {color ? <meshBasicMaterial color={color} /> : <meshMatcapMaterial matcap={matcapTex} />}
            </mesh>
        </group>
    )
}
