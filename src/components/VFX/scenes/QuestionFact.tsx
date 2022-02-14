import { Text, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

import { useReplay } from '../../../pages/Landing/useReplay'
import matcap from '../assets/matcap_texture.png'

export const QuestionFact = () => {
    const { event } = useReplay()
    const matcapTex = useTexture(matcap)
    const width = useThree(({ viewport }) => viewport.width)

    if (!event || event.type !== 'question_fact') {
        return null
    }

    return (
        <Text
            textAlign="center"
            font="fonts/BlackerSansText-Heavy.ttf"
            // fontSize={(1 * width) / (3 * 15)}
            fontSize={width / 35}
            maxWidth={width * 0.5}
        >
            {event.text}
            <meshMatcapMaterial matcap={matcapTex} />
        </Text>
    )
}
