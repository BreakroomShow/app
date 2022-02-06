import { ReactNode } from 'react'

import { useSubmitAnswer } from '../api/mutations'
import { usePlayerQuery, useQuestionsQuery } from '../api/query'
import { ResultIcon } from '../components/ResultIcon'
import { Segment } from '../components/Segment'
import { Timer } from '../components/Timer'
import { Typography } from '../design-system'
import { useTime } from '../hooks/useTime'
import { Game } from '../types'
import { bnToMs } from '../utils/date'
import { RevealedQuestionScreen } from './RevealedQuestionScreen'

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

    let resultIcon: ReactNode = null
    if (canAnswer) {
        resultIcon = <Timer deadline={deadline} />
    } else if (correctAnswer != null && !hasSkippedQuestion) {
        resultIcon = <ResultIcon variant={userAnswer === correctAnswer ? 'correct' : 'wrong'} />
    }

    return (
        <Segment color="black" w={4} h={3} inset="lg">
            <RevealedQuestionScreen
                questionId={questionId}
                totalQuestions={questions.length}
                questionText={revealedQuestion.question}
                answers={revealedQuestion.variants}
                userAnswer={userAnswer}
                correctAnswer={correctAnswer}
                answerCount={correctAnswer == null ? null : [2100, 5523, 4245]} // TODO real stats
                answered={answered}
                lives={lives}
                fund={fund}
                resultIcon={resultIcon}
                onAnswer={canAnswer ? (variantId) => submitAnswer({ questionKey, variantId }) : null}
            />
        </Segment>
    )
}
