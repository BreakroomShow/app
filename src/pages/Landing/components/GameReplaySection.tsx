import { useEffect, useReducer, useRef } from 'react'

import { Box, Stack, Typography, styled } from '../../../design-system'
import { ReactComponent as PlayIcon } from '../../../images/play.svg'
import { videoUrl } from '../const'

const VideoContainer = styled(Box, {
    position: 'relative',
    width: '100%',
    borderRadius: '$md',
    overflow: 'hidden',
    lineHeight: 0,

    '& video': {
        width: '100%',
    },
})

const VideoOverlay = styled(Box, {
    borderRadius: 'inherit',
    background: '$blackA',
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
})

const VideoBadge = styled(Box, {
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

export function GameReplaySection() {
    const [play, togglePlay] = useReducer((prev) => !prev, false)
    const ref = useRef<HTMLVideoElement | null>(null)

    useEffect(() => {
        if (play) {
            ref.current?.play()
        } else {
            ref.current?.pause()
        }
    }, [play])

    return (
        <VideoContainer tabIndex={0} onClick={togglePlay}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video muted ref={ref} src={videoUrl} />
            {play ? null : (
                <VideoOverlay>
                    <PlayIcon />
                    <VideoBadge>
                        <Stack align="center" space="sm">
                            <PlayIconSmall />
                            <Typography as="body2" color="white" align="center">
                                Last Game Replay
                            </Typography>
                        </Stack>
                    </VideoBadge>
                </VideoOverlay>
            )}
        </VideoContainer>
    )
}
