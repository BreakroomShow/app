import { useEffect, useState } from 'react'

import { Box, Spacer, Text, keyframes, styled } from '../../../design-system'
import { useDebounce } from '../../../hooks/useDebounce'
import { useGetLatest } from '../../../hooks/useGetLatest'
import { nbsp } from '../const'

const Title = styled('span', {
    display: 'block',

    fontFamily: '$heading',
    fontWeight: '$bold',
    color: '$black',

    fontSize: '88px',
    lineHeight: '90px',
    '@down-xl': {
        fontSize: '66px',
        lineHeight: '68px',
    },
    '@down-lg': {
        fontSize: '50px',
        lineHeight: '52px',
    },

    textAlign: 'center',
})

const Caret = styled('span', {
    position: 'relative',

    '&:after': {
        content: '""',
        position: 'absolute',
        display: 'inline-block',
        width: 4,
        height: '100%',
        background: '$orange',
    },

    variants: {
        animated: {
            true: {
                animation: `${keyframes({ '0%': { opacity: 1 }, '50%': { opacity: 0 } })} 1.2s`,
                animationIterationCount: 'infinite',
            },
        },
    },
})

export function PageTitle() {
    const [text, isTyping] = useTextTyping(['With Prizes', 'on Solana', 'for Newcomers'])

    return (
        <Box>
            <Title>On-chain Live{nbsp}Trivia</Title>
            <Title>
                {nbsp}
                {text}
                <Caret animated={!isTyping} />
            </Title>
            <Spacer size="lg" />
            <Text font="body" size="lg" color="blackA" align="center">
                Answer twelve questions in the game and win crypto
            </Text>
        </Box>
    )
}

function useTextTyping(
    words: string[],
    { pauseDelay = 2000, typingDelay = 150 }: { pauseDelay?: number; typingDelay?: number } = {},
) {
    const [text, setText] = useState('')
    const textDebounced = useDebounce(text, 500)
    const getText = useGetLatest(() => text)
    const getWords = useGetLatest(() => words)

    useEffect(() => {
        setText('')

        let currentWord = 0
        let currentLetter = 0
        let intervalId: number

        const withPause = (afterPause: () => void, delay = pauseDelay) => {
            intervalId = window.setTimeout(afterPause, delay)
        }

        const runLoop = (loop: () => void) => {
            intervalId = window.setInterval(loop, typingDelay)
        }

        const stopLoop = () => {
            window.clearInterval(intervalId)
            window.clearTimeout(intervalId)
        }

        function enterLoop() {
            const word = getWords()[currentWord] || ''
            const letter = word[currentLetter] || ''

            requestAnimationFrame(() => {
                setText((prev) => `${prev}${letter}`)
            })
            currentLetter = Math.min(currentLetter + 1, word.length)

            if (!letter) {
                stopLoop()

                withPause(() => runLoop(deleteLoop))
            }
        }

        function deleteLoop() {
            const currentText = getText()

            if (currentText.length <= 1) {
                currentWord = (currentWord + 1) % getWords().length
                currentLetter = 0
                stopLoop()
                withPause(() => runLoop(enterLoop), typingDelay)
            }

            requestAnimationFrame(() => {
                setText((prev) => prev.slice(0, -1))
            })
        }

        runLoop(enterLoop)

        return stopLoop
    }, [getText, getWords, pauseDelay, typingDelay])

    const isTyping = text !== textDebounced

    return [text, isTyping] as const
}
