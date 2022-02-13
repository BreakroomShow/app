import confetti from 'canvas-confetti'
import { ReactNode, useEffect } from 'react'

import { Answer, AnswerVariant } from '../components/Answer'
import { Label } from '../components/Label'
import { Box, Inline, Stack, Typography } from '../design-system'
import { ReactComponent as Heart } from '../images/heart.svg'
import { useReplay } from '../pages/Landing/useReplay'
import { ordinal } from '../utils/ordinal'

interface RevealedQuestionScreenProps {
    questionId: number
    totalQuestions: number

    questionText: string
    answers: [string, string, string]
    userAnswer: number | null
    correctAnswer: number | null
    answerCount: Record<'0' | '1' | '2', number> | null

    answered: number
    lives: number
    fund: number

    resultIcon?: ReactNode
    onAnswer?: null | ((answerIndex: number) => void)
}

function useConfetti(show: boolean) {
    const { isPlaying, speed } = useReplay()

    /* prettier-ignore */
    useEffect(() => {
        if (!isPlaying) return
        if (!show) return

        function fire(x: number, y: number, opts: confetti.Options) {
            confetti({
                shapes: ['circle'],
                origin: { y, x },
                particleCount: 50,
                ...opts,
            })
        }

        fire(0,   0.8, { angle: 50,  spread: 60, startVelocity: 50, ticks: 120 / speed, scalar: 1.4, gravity: 0.3 * speed, drift:  1 })
        fire(1,   0.8, { angle: 130, spread: 60, startVelocity: 50, ticks: 120 / speed, scalar: 1.4, gravity: 0.3 * speed, drift: -1 })
        fire(0.3, 1,   { angle: 60,  spread: 70, startVelocity: 65, ticks: 150 / speed, scalar: 1.6, gravity: 0.7 * speed, drift: -2 })
        fire(0.7, 1,   { angle: 120, spread: 70, startVelocity: 65, ticks: 150 / speed, scalar: 1.6, gravity: 0.7 * speed, drift:  2 })

        return () => {
            confetti.reset()
        }
    }, [isPlaying, show, speed])
}

export function RevealedQuestionScreen({
    questionId,
    totalQuestions,

    questionText,
    answers,
    userAnswer,
    correctAnswer,
    answerCount,

    answered,
    lives,
    fund,

    resultIcon,
    onAnswer,
}: RevealedQuestionScreenProps) {
    const show = userAnswer != null && userAnswer === correctAnswer
    useConfetti(show)

    const totalAnswers = answerCount ? Object.values(answerCount).reduce((acc, c) => acc + c, 0) : null

    return (
        <Box css={{ width: '100%' }}>
            <Box css={{ display: 'flex', justifyContent: 'space-between', height: 84 }}>
                {resultIcon || <div />}
                <Inline space="sm">
                    <Label text={answered.toLocaleString('en')} description="answered" />
                    <Label
                        description="extra lives"
                        text={
                            <Inline space="xs" alignY="center" align="center">
                                <Heart />
                                <Typography as="h3" color="white">
                                    {lives}
                                </Typography>
                            </Inline>
                        }
                    />
                    <Label text={`$${fund}`} description="general fund" />
                </Inline>
            </Box>

            <Box css={{ height: 56 }} />

            <Stack space="xxxl">
                <Stack space="md">
                    <Typography as="text2" color="whiteA">
                        {ordinal(questionId + 1)} of {totalQuestions}
                    </Typography>
                    <Typography as="h2" color="white">
                        {questionText}
                    </Typography>
                </Stack>
                <Stack space="sm">
                    {answers.map((variant, i) => {
                        const index = i as 0 | 1 | 2

                        let answerVariant: AnswerVariant = 'neutral'
                        if (userAnswer === index) answerVariant = correctAnswer == null ? 'pending' : 'wrong'
                        if (correctAnswer === index) answerVariant = 'correct'

                        const count = answerCount ? answerCount[index] : null

                        return (
                            <Answer
                                key={index}
                                index={index}
                                variant={answerVariant}
                                disabled={!onAnswer}
                                onClick={() => onAnswer?.(index)}
                                count={count}
                                share={count && totalAnswers ? count / totalAnswers : null}
                            >
                                {variant}
                            </Answer>
                        )
                    })}
                </Stack>
            </Stack>
        </Box>
    )
}
