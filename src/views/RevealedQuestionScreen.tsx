import { ReactNode } from 'react'

import { Answer, AnswerVariant } from '../components/Answer'
import { Label } from '../components/Label'
import { Segment } from '../components/Segment'
import { Box, Inline, Stack, Typography } from '../design-system'
import { ReactComponent as Heart } from '../images/heart.svg'
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
    const totalAnswers = answerCount ? Object.values(answerCount).reduce((acc, c) => acc + c, 0) : null

    return (
        <Segment color="black" w={4} h={3} inset="lg">
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
                            if (userAnswer === index) answerVariant = correctAnswer == null ? 'correct' : 'wrong'
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
        </Segment>
    )
}
