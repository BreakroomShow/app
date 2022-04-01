import { BufferGeometryNode, ReactThreeFiber, extend } from '@react-three/fiber'
import { BoxGeometry, MeshBasicMaterial, ShaderMaterial } from 'three'
import { RoundedBoxGeometry } from 'three-stdlib'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

import { MeshLine, MeshLineMaterial, MeshLineRaycast } from './MeshLine'
import { AnimatedGalaxyMaterial, uniforms } from './shaders/AnimatedGalaxyMaterial'

export type AnimatedGalaxyMaterialRef = ShaderMaterial & typeof uniforms

export type MeshLineRef = MeshBasicMaterial & {
    points?: ReactThreeFiber.Vector3[]
    advance(vec: ReactThreeFiber.Vector3): void
    uniforms?: { dashOffset: { value: number }; lineWidth: { value: number } }
}

export type MeshLineMaterialRef = MeshBasicMaterial & {
    transparent?: boolean
    lineWidth?: number
    color?: string
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            animatedGalaxyMaterial: ReactThreeFiber.MaterialNode<AnimatedGalaxyMaterialRef, []>
            meshLine: ReactThreeFiber.MaterialNode<MeshLineRef, []>
            meshLineMaterial: ReactThreeFiber.MaterialNode<MeshLineMaterialRef, []>
            textGeometry: BufferGeometryNode<TextGeometry, typeof TextGeometry>
            roundedBoxGeometry: ReactThreeFiber.BufferGeometryNode<RoundedBoxRef, []>
        }
    }
}

export type RoundedBoxRef = BoxGeometry & {
    radius?: number
}

extend({
    AnimatedGalaxyMaterial,
    MeshLine,
    RoundedBoxGeometry,
    MeshLineMaterial,
    MeshLineRaycast,
    TextGeometry,
})
