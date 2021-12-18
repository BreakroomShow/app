import { ReactNode } from 'react'

import { Box, Stack, Typography, styled } from '../design-system'

interface LabelProps {
    text: ReactNode
    description: ReactNode
}

const LabelContainer = styled(Box, {
    borderRadius: '$md',
    background: '$darkGrey',
    paddingX: '$xxxl',
    height: 84,
    display: 'flex',
    alignItems: 'center',
})

export function Label({ text, description }: LabelProps) {
    return (
        <LabelContainer>
            <Stack align="center">
                {typeof text === 'string' ? (
                    <Typography as="h3" color="white">
                        {text}
                    </Typography>
                ) : (
                    text
                )}
                {typeof description === 'string' ? (
                    <Typography as="text2" color="whiteA">
                        {description}
                    </Typography>
                ) : (
                    text
                )}
            </Stack>
        </LabelContainer>
    )
}
