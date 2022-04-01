/* eslint-disable @typescript-eslint/no-shadow */
import { useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Box, Flex, useFlexSize } from '@react-three/flex'
import { useMemo } from 'react'

import { theme } from '../../../design-system'
import { GameEvent } from '../../../types'
import initialMatcap from '../assets/matcap_texture_white.png'
import { MultilineTextPro } from '../components/MultilineText'

const Inner = ({
    texts,
    color,
    textColor = '#fff',
}: {
    texts?: {
        text: string
        size: number
    }[]
    textColor?: string
    color?: string
}) => {
    const [width, height] = useFlexSize() || 1

    const matcap = useTexture(initialMatcap)

    return (
        <>
            <MultilineTextPro
                textProps={{ matcap: initialMatcap, color: textColor, matcapEnabled: true }}
                texts={texts}
                sizeScale={height / 2.3}
                size={[width, height, 1]}
                position={[-width / 2, height / 2, 0.5]}
            />
            <mesh scale={[width, width, 1]}>
                {/* @ts-ignore */}
                <roundedBoxGeometry args={[1, height / width, 1, 5, 100]} />
                <meshMatcapMaterial matcap={matcap} color={color} />
            </mesh>
        </>
    )
}

export const GameInfoSplash = ({ event }: { event: GameEvent }) => {
    // eslint-disable-next-line no-shadow
    const viewport = useThree(({ viewport }) => viewport)

    const size = useMemo(() => {
        const { width, height, aspect } = viewport

        const _size: [number, number, number] = aspect < 1 ? [width, width * 0.6, 1] : [height, height * 0.6, 1]
        return _size
    }, [viewport])

    if (!event || event.type !== 'game_info_splash') return null
    return (
        <Flex size={size} position={[-size[0] / 2, size[1] / 2, -1]}>
            <Box flexDir="row" width="auto" height="auto" flexGrow={1}>
                <Box width="auto" height="auto" centerAnchor flexGrow={1}>
                    <Inner
                        texts={[
                            {
                                text: event.prize_fund_usd.toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0,
                                }),
                                size: 0.5,
                            },
                            { text: 'prize fund', size: 0.15 },
                        ]}
                        textColor="#434343"
                        color={theme.colors.pink.value}
                    />
                </Box>
                <Box width="auto" height="auto" flexDir="row" centerAnchor flexGrow={1}>
                    <Inner
                        texts={[
                            { text: event.players.toLocaleString('en'), size: 0.5 },
                            { text: 'players today', size: 0.15 },
                        ]}
                        textColor="#434343"
                        color={theme.colors.beige.value}
                    />
                </Box>
            </Box>
            <Box width="auto" height="auto" flexDir="row" centerAnchor flexGrow={1}>
                <Inner
                    texts={[
                        { text: event.sponsor_title, size: 0.5 },
                        { text: 'sponsor', size: 0.15 },
                    ]}
                    color={theme.colors.orange.value}
                />
            </Box>
        </Flex>
    )
}
