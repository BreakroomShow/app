import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import { useEffect, useReducer, useRef } from 'react'

import { Box, Stack, Typography, styled } from '../../../design-system'
import { ReactComponent as PlayIcon } from '../../../images/play.svg'
import { useReplayBridge } from '../useReplayBridge'

const Container = styled(Box, {
    position: 'relative',
    width: '100%',
    borderRadius: '$md',
    overflow: 'hidden',
    lineHeight: 0,
    transform: 'translateZ(0)',
})

const Overlay = styled(Box, {
    borderRadius: 'inherit',
    background: '$blackA',
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    variants: {
        visible: {
            false: {
                opacity: 0,
                transition: 'opacity .3s',
            },
        },
    },
})

const Badge = styled(Box, {
    size: 160,
    padding: 25,
    '@down-md': {
        size: 100,
        padding: 0,
    },
    borderRadius: '$round',
    background: '$blue',

    position: 'absolute',
    top: 20,
    right: 20,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    transform: 'rotate(20deg)',

    pointerEvents: 'none',
    userSelect: 'none',
})

const PlayButton = styled(Box, {
    position: 'absolute',
    inset: 0,
    margin: 'auto',
    size: 92,
})

const PlayIconSmall = styled(Box, {
    $$size: '15px',
    '@down-md': {
        $$size: '10px',
    },

    borderTop: '$$size solid transparent',
    borderBottom: '$$size solid transparent',
    borderLeft: 'calc($$size * 1.5) solid $colors$whiteA',
    marginLeft: 'calc($$size - 5px)',
})

const GameReplayContainer = styled(Box, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    size: '100%',
    background: 'black',
})

const TARGET_WIDTH = 1280
const RATIO = 16 / 10

const Iframe = styled('iframe', {
    border: 'none',
    padding: 0,
    margin: 0,

    width: TARGET_WIDTH,
    height: TARGET_WIDTH / RATIO,
    position: 'absolute',
})

export function GameReplaySection() {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const iframeRef = useRef<HTMLIFrameElement | null>(null)

    useEffect(() => {
        const onResize = () => {
            if (!containerRef.current) return
            if (!iframeRef.current) return

            const { width } = containerRef.current.getBoundingClientRect()

            iframeRef.current.style.transform = `scale(${width / TARGET_WIDTH})`
        }

        onResize()

        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [])

    const [play, togglePlay] = useReducer((prev) => !prev, false)
    const [bridge, onLoad] = useReplayBridge()

    useEffect(() => {
        if (!bridge) return

        bridge.postMessage('Play', play)
    }, [bridge, play])

    return (
        <Container
            tabIndex={0}
            onClick={bridge ? togglePlay : undefined}
            onKeyPress={(e) => (e.key === 'Enter' && bridge ? togglePlay() : undefined)}
        >
            <AspectRatio ratio={RATIO}>
                <GameReplayContainer ref={containerRef}>
                    <Iframe title="game replay" src="/_replay" ref={iframeRef} onLoad={onLoad} tabIndex={-1} />
                </GameReplayContainer>

                <Overlay visible={!play} />
                {play ? null : (
                    <>
                        {bridge ? (
                            <PlayButton>
                                <PlayIcon />
                            </PlayButton>
                        ) : null}
                        <Badge>
                            <Stack align="center" space="sm">
                                <PlayIconSmall />
                                <Typography as="body2" color="white" align="center">
                                    Last Game Replay
                                </Typography>
                            </Stack>
                        </Badge>
                    </>
                )}
            </AspectRatio>
        </Container>
    )
}
