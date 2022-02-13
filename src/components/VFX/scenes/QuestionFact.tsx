import { Text, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

import { useReplay } from '../../../pages/Landing/useReplay'
import { QuestionFactEvent } from '../../../types'
import matcap from '../assets/matcap_texture.png'

const QuestionFact = () => {
    const { event } = useReplay()
    const matcapTex = useTexture(matcap)
    const { width } = useThree(({ viewport }) => viewport)
    console.log(width)
    return (
        <Text
            textAlign="center"
            font="fonts/BlackerSansText-Heavy.ttf"
            // fontSize={(1 * width) / (3 * 15)}
            fontSize={width / 35}
            maxWidth={width * 0.5}
        >
            {(event as QuestionFactEvent).text}
            <meshMatcapMaterial matcap={matcapTex} />
        </Text>
    )
}

export default QuestionFact
