import { VariantProps } from '@stitches/react'

import { Box, styled } from '../design-system'
import { ReactComponent as Check } from '../images/check.svg'
import { ReactComponent as Cross } from '../images/cross.svg'

const Container = styled(Box, {
    size: 84,
    borderRadius: '$round',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,

    transition: 'background 0.5s',

    variants: {
        variant: {
            correct: {
                background: '$brightGreen',
                color: '$black',
            },
            wrong: {
                background: '$orange',
                color: '$white',
            },
        },
    },
})

export function ResultIcon({ variant }: VariantProps<typeof Container>) {
    return (
        <Container variant={variant}>
            {variant === 'correct' ? <Check /> : null}
            {variant === 'wrong' ? <Cross /> : null}
        </Container>
    )
}
