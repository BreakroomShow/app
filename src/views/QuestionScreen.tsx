import { useSubmitAnswer } from '../api/mutations'
import { usePlayerQuery, useQuestionsQuery } from '../api/query'
import { Answer, AnswerVariant } from '../components/Answer'
import { Label } from '../components/Label'
import { ResultIcon } from '../components/ResultIcon'
import { Segment } from '../components/Segment'
import { Timer } from '../components/Timer'
import { Box, Inline, Stack, Typography } from '../design-system'
import { useTime } from '../hooks/useTime'
import { ReactComponent as Heart } from '../images/heart.svg'
import { Game } from '../types'
import { bnToMs } from '../utils/date'
import { ordinal } from '../utils/ordinal'

interface QuestionsScreenProps {
    gameId: number
    game: Game
}

export function QuestionScreen({ gameId, game }: QuestionsScreenProps) {
    const answered = 1089
    const fund = 560
    const lives = 2

    const { mutate: submitAnswer } = useSubmitAnswer(gameId)
    const { data: player = null, ...playerQuery } = usePlayerQuery(gameId)
    const { data: questions = [], ...questionsQuery } = useQuestionsQuery(
        gameId,
        game.questionKeys.filter((key): key is NonNullable<typeof key> => !!key),
    )

    const time = useTime()

    const questionId = game.revealedQuestionsCounter ? game.revealedQuestionsCounter - 1 : null

    if (questionId == null) {
        return (
            <Segment color="black" w={4} h={3} inset="lg">
                <Typography as="h1" color="white">
                    First question is coming soon
                </Typography>
            </Segment>
        )
    }

    const revealedQuestion = questions[questionId]?.revealedQuestion || null
    const questionKey = game.questionKeys[questionId]

    if (questionsQuery.isIdle || questionsQuery.isLoading || playerQuery.isIdle || playerQuery.isLoading) {
        return (
            <Segment color="black" w={4} h={3} inset="lg">
                <Typography as="text1" color="whiteA">
                    Loading...
                </Typography>
            </Segment>
        )
    }

    if (!revealedQuestion) {
        return (
            <Segment color="black" w={4} h={3} inset="lg">
                {questionsQuery.isFetching ? (
                    <Typography as="text1" color="whiteA">
                        Loading...
                    </Typography>
                ) : (
                    <Typography as="h2" color="orange">
                        Something went wrong. Question should be revealed
                    </Typography>
                )}
            </Segment>
        )
    }

    const playerAnswers = player?.answers || []
    const hasSkippedQuestion = questionId > playerAnswers.length
    const userAnswer = playerAnswers[questionId] ?? null
    const correctAnswer = revealedQuestion.answerVariantId ?? null
    const deadline = bnToMs(revealedQuestion.deadline)
    const deadlineExceed = time.moreThan(deadline)
    const canAnswer =
        questionKey && correctAnswer == null && userAnswer == null && !deadlineExceed && !hasSkippedQuestion

    return (
        <Segment color="black" w={4} h={3} inset="lg">
            <Box css={{ width: '100%' }}>
                <Box css={{ display: 'flex', justifyContent: 'space-between', height: 84 }}>
                    {(() => {
                        if (canAnswer) {
                            return <Timer deadline={deadline} />
                        }

                        if (correctAnswer != null && !hasSkippedQuestion) {
                            return <ResultIcon variant={userAnswer === correctAnswer ? 'correct' : 'wrong'} />
                        }

                        return <div />
                    })()}
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
                            {ordinal(questionId + 1)} of {questions.length}
                        </Typography>
                        <Typography as="h2" color="white">
                            {revealedQuestion.question}
                        </Typography>
                    </Stack>
                    <Stack space="sm">
                        {revealedQuestion.variants.map((variant, i) => {
                            const index = i as 0 | 1 | 2

                            let answerVariant: AnswerVariant = 'neutral'
                            if (userAnswer === index) answerVariant = correctAnswer == null ? 'correct' : 'wrong'
                            if (correctAnswer === index) answerVariant = 'correct'

                            return (
                                <Answer
                                    key={index}
                                    index={index}
                                    variant={answerVariant}
                                    disabled={!canAnswer}
                                    onClick={() => {
                                        if (canAnswer) submitAnswer({ questionKey, variantId: index })
                                    }}
                                    // TODO real stats
                                    count={correctAnswer == null ? undefined : 6624 / (index + 1)}
                                    share={correctAnswer == null ? undefined : 6624 / (index + 1) / 12144}
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
