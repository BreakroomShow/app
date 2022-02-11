import { Box, Column, Columns, Inline, Typography, keyframes, styled } from '../design-system'
import { CountUp } from './CountUp'

export type AnswerVariant = 'correct' | 'wrong' | 'neutral' | 'pending'

interface AnswerProps {
    index: 0 | 1 | 2
    count?: number | null
    share?: number | null
    variant: AnswerVariant
    children: string
    disabled?: boolean
    onClick?(): void
}

const AnswerContainer = styled('button', {
    all: 'unset',
    display: 'block',
    width: '100%',
    cursor: 'unset',

    position: 'relative',
    overflow: 'radius',

    borderRadius: '$md',
    paddingX: '$xxxl',
    paddingY: '$xxl',

    transition: 'background 0.5s, transform .3s',

    '&:not([disabled])': {
        cursor: 'pointer',
        '&:active': {
            transform: 'scale(1.02)',
        },
        '&:focus-visible': {
            boxShadow: '0px 0px 0px 4px $colors$whiteA',
        },
    },

    variants: {
        variant: {
            correct: {
                $$fillColor: '#B5E245',
                background: '$brightGreen',
            },
            wrong: {
                $$fillColor: '#D93E29',
                background: '$orange',
            },
            pending: {
                background: '$yellow',
            },
            neutral: {
                $$fillColor: '#3B3B3B',
                boxShadow: `0 0 0 $borderWidths$xs $$fillColor`,
            },
        },
    },
})

const AnswerFill = styled(Box, {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    background: '$$fillColor',
    transition: 'width 3s, background .5s',
    animation: `${keyframes({ from: { width: 0 } })} 3s`,
    width: 0,
})

const letters = ['A', 'B', 'C'] as const

export function Answer({ index, children, variant, count, share, disabled, onClick }: AnswerProps) {
    const letter = letters[index]

    return (
        <AnswerContainer variant={variant} tabIndex={0} disabled={disabled} onClick={onClick}>
            <AnswerFill css={{ width: share ? `${share * 100}%` : 0 }} />
            <Box css={{ position: 'relative' }}>
                <Columns alignY="center">
                    <Column>
                        <Inline space="md" wrap="nowrap">
                            <Typography
                                as="h3"
                                color={variant === 'correct' || variant === 'pending' ? 'greyA' : 'whiteA'}
                            >
                                {letter}
                            </Typography>
                            <Typography
                                as="h3"
                                color={variant === 'correct' || variant === 'pending' ? 'black' : 'white'}
                            >
                                {children}
                            </Typography>
                        </Inline>
                    </Column>
                    {count ? (
                        <Column width="content">
                            <Typography as="text2" color={variant === 'neutral' ? 'whiteA' : 'greyA'}>
                                <CountUp>{count}</CountUp>
                            </Typography>
                        </Column>
                    ) : null}
                </Columns>
            </Box>
        </AnswerContainer>
    )
}
