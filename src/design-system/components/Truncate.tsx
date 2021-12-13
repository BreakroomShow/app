import { styled } from '../config'
import { mapVariantsToStyle } from '../utils'

export const Truncate = styled('span', {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',

    variants: {
        lines: {
            1: { whiteSpace: 'nowrap' },
            ...mapVariantsToStyle([2, 3, 4, 5] as const, (lines) => ({
                display: '-webkit-box',
                WebkitLineClamp: lines,
                WebkitBoxOrient: 'vertical',
            })),
        },
    },

    defaultVariants: {
        lines: '1',
    },
})
