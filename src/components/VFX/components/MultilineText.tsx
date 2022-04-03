import { Box, Flex } from '@react-three/flex'

import { VerticalCenter } from '../helpers/VerticalCenter'
import { Text } from './Text'

export const MultilineText = ({ texts = ['Breakroom', 'Show'], size = 0.5 }) => {
    return (
        <VerticalCenter>
            <Flex justifyContent="center">
                {texts.map((el, i) => (
                    <group key={i}>
                        <Box height={size * 0.5}>
                            <Text size={size} vAlign="bottom">
                                {el}
                            </Text>
                        </Box>
                        {i < texts.length - 1 ? <Box padding={0.35 * size}>null</Box> : null}
                    </group>
                ))}
            </Flex>
        </VerticalCenter>
    )
}

export const MultilineTextPro = ({
    texts = [
        { text: '15,230', size: 0.5 },
        { text: 'players today', size: 0.15 },
    ],
    sizeScale = 1,
    textProps = {},
    ...props
}) => {
    return (
        <Flex align="center" justify="center" {...props}>
            {texts.map(({ size, text }, i) => (
                <Box centerAnchor width={1} key={i} height={size * sizeScale} marginTop={i > 0 ? 0.15 * sizeScale : 0}>
                    <Text size={size * sizeScale} {...textProps}>
                        {text}
                    </Text>
                </Box>
            ))}
        </Flex>
    )
}
