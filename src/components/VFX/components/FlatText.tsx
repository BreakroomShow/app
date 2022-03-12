import { Text, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

import matcap from '../assets/matcap_texture.png'

export const FlatText = ({ text, widthCoeff = 0.5 }: { text: String; widthCoeff: number }) => {
    const matcapTex = useTexture(matcap)
    const width = useThree(({ viewport }) => viewport.width)

    return (
        <Text
            textAlign="center"
            font="fonts/BlackerSansText-Heavy.ttf"
            fontSize={width / 35}
            maxWidth={width * widthCoeff}
        >
            {text}
            <meshMatcapMaterial matcap={matcapTex} />
        </Text>
    )
}
