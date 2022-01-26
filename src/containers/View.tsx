import { ReactNode } from 'react'

import { SEGMENT_WIDTH, SegmentContainer } from '../components/Segment'
import { Box, styled } from '../design-system'

const Container = styled(Box, {
    marginX: 'auto',

    display: 'flex',
    maxWidth: SEGMENT_WIDTH * 6,

    '@down-xl': {
        flexDirection: 'column',
        maxWidth: SEGMENT_WIDTH * 4,
    },
})

export function View({ children }: { children: ReactNode }) {
    return (
        <Container>
            <SegmentContainer>{children}</SegmentContainer>
        </Container>
    )
}
