import { Box, styled } from '../../../design-system'

export const PageBlock = styled(Box, {
    position: 'relative',

    paddingY: 124,
    borderRadius: '$lg',
    '@down-md': {
        paddingY: 50,
        borderRadius: '$md',
    },

    variants: {
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
