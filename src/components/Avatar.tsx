import { styled } from '../design-system'

export const Avatar = styled('img', {
    borderRadius: 100,
    flexShring: 0,

    variants: {
        size: {
            sm: { size: 24 },
            md: { size: 28 },
        },
    },

    defaultVariants: {
        size: 'md',
    },
})
