import { styled } from '../config'
import { Box } from './Box'

export const Spacer = styled(Box, {
    variants: {
        size: {
            sm: { minSize: 10 },
            md: { minSize: 20 },
            lg: { minSize: 40 },
            xl: { minSize: 86 },
            bleed: {
                display: 'flex',
                flex: '1 1 auto',
            },
        },
    },

    defaultVariants: {
        size: 'bleed',
    },
})
