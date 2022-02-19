import { Box, Flex } from '@react-three/flex'

import { Text } from './Text'

export const MultilineText = ({ texts = ['Breakroom', 'Show'], size = 1 }) => {
    return (
        <Flex justifyContent="center">
            {texts.map((el, i) => (
                <group key={i}>
                    <Box height={size * 0.5}>
                        <Text size={size} dontAlign>
                            {el}
                        </Text>
                    </Box>
                    {i < texts.length - 1 ? <Box padding={0.15 * size}>null</Box> : null}
                </group>
            ))}
        </Flex>
    )
}
