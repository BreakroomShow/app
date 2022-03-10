import { Box, styled } from '../../../design-system'

export const PageBlock = styled(Box, {
    position: 'relative',
    paddingY: 124,
    '@down-md': {
        paddingY: 50,
        borderRadius: '$md',
    },

    defaultVariants: {
        radius: 'xl',
        variant: 'light',
    },

    variants: {
        radius: {
            lg: {
                borderRadius: '$lg',
            },
            xl: {
                borderRadius: '$xl',
            },
        },
        variant: {
            dark: {
                background: '$black',
                color: '$white',
            },
            light: {
                background: '$white',
                color: '$black',
            },
        },
    },
})
