import { VariantProps } from '@stitches/react'
import { ReactNode } from 'react'

import { Box, Color, keyframes, styled } from '../design-system'

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
        animation: {
            enter: {
                animation: `${keyframes({ from: { transform: 'scale(0)' } })} 0.3s`,
            },
            exit: {
                transform: 'scale(0)',
                animation: `${keyframes({ from: { transform: 'scale(1)' } })} 0.3s`,
            },
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
    animation?: 'enter' | 'exit'
}

export function Segment({
    w = 1,
    h = 1,
    variant = 'round',
    inset,
    color = 'black',
    animation,
    children,
}: SegmentProps) {
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
            animation={animation}
        >
            {children}
        </SegmentComponent>
    )
}
