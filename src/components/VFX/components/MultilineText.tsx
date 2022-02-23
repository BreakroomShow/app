import { Center } from '@react-three/drei'
import { Box, Flex } from '@react-three/flex'

import { Text } from './Text'

export const MultilineText = ({ texts = ['Breakroom', 'Show'], size = 1 }) => {
    return (
        <Flex justifyContent="center">
            {texts.map((el, i) => (
                <group key={i}>
                    <Box height={size * 0.5}>
                        <Text size={size} vAlign="bottom">
                            {el}
                        </Text>
                    </Box>
                    {i < texts.length - 1 ? <Box padding={0.15 * size}>null</Box> : null}
                </group>
            ))}
        </Flex>
    )
}

export const MultilineTextPro = ({
    texts = [
        { text: 'players today', size: 0.32 },
        { text: '15,230', size: 1 },
    ],
    textProps = {},
}) => {
    return (
        <Center>
            <Flex justifyContent="center">
                {texts.map(({ size, text }, i) => (
                    <group key={i}>
                        <Box height={size * 0.5}>
                            <Text size={size} vAlign="bottom" {...textProps}>
                                {text}
                            </Text>
                        </Box>
                        {i < texts.length - 1 ? <Box padding={0.15 * size}>null</Box> : null}
                    </group>
                ))}
            </Flex>
        </Center>
    )
}
