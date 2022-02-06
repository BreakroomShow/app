import { SEGMENT_WIDTH } from '../components/Segment'
import { Box, styled } from '../design-system'

export const View = styled(Box, {
    marginX: 'auto',

    display: 'flex',
    maxWidth: SEGMENT_WIDTH * 6,

    '@down-xl': {
        flexDirection: 'column',
        maxWidth: SEGMENT_WIDTH * 4,
    },
})
