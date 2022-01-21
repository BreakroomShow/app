import { VariantProps } from '@stitches/react'
import { ReactNode } from 'react'

import { Box, Color, styled } from '../design-system'

type Size = 1 | 2 | 3 | 4

export const SEGMENT_WIDTH = 212
export const SEGMENT_HEIGHT = 244

export const SegmentComponent = styled(Box, {
    overflow: 'hidden',
    display: 'flex',
    flexGrow: 1,
    variants: {
        variant: {
            round: { borderRadius: '$md' },
            pill: { borderRadius: '$pill' },
        },
        inset: {
            md: { padding: 50 },
            lg: { padding: 60 },
            center: { alignItems: 'center', justifyContent: 'center' },
        },
    },
})

export const SegmentContainer = styled(Box, {
    display: 'grid',
    gridTemplateColumns: `repeat(4, minmax(${SEGMENT_WIDTH - 40}px, ${SEGMENT_WIDTH}px))`,
})

interface SegmentProps extends VariantProps<typeof SegmentComponent> {
    w?: Size
    h?: Size
    color?: Color
    children: ReactNode
}

export function Segment({ w = 1, h = 1, variant = 'round', inset, color = 'black', children }: SegmentProps) {
    return (
        <SegmentComponent
            inset={inset}
            variant={variant}
            css={{
                background: `$${color}`,
                minHeight: SEGMENT_HEIGHT * h,
                gridColumn: `span ${w}`,
                gridRow: `span ${h}`,
            }}
        >
            {children}
        </SegmentComponent>
    )
}

export const ChatSegment = styled(SegmentComponent, {
    background: `$white`,
    minHeight: SEGMENT_HEIGHT * 1.5,
    minWidth: SEGMENT_WIDTH * 1.5,

    defaultVariants: {
        variant: 'round',
    },
})
