import { useSubmitAnswer } from '../api/mutations'
import { usePlayerQuery, useQuestionsQuery } from '../api/query'
import { useTime } from '../hooks/useTime'
import { Game } from '../types'
import { bnToLocaleString, bnToMs } from '../utils/date'

interface QuestionsScreenProps {
    gameId: number
    game: Game
}

export function QuestionScreen({ gameId, game }: QuestionsScreenProps) {
    const submitAnswer = useSubmitAnswer(gameId)
    const { data: player = null, ...playerQuery } = usePlayerQuery(gameId)
    const { data: questions = [], ...questionsQuery } = useQuestionsQuery(
        gameId,
        game.questionKeys.filter((key): key is NonNullable<typeof key> => !!key),
    )

    console.log({ player })

    const time = useTime()

    const questionId = game.revealedQuestionsCounter ? game.revealedQuestionsCounter - 1 : null
    if (questionId == null) {
        return <p style={{ color: '#66bb6a', fontStyle: 'italic' }}>First question is coming soon</p>
    }

    const revealedQuestion = questions[questionId]?.revealedQuestion || null
    const questionKey = game.questionKeys[questionId]

    if (questionsQuery.isIdle || questionsQuery.isLoading || playerQuery.isIdle || playerQuery.isLoading) {
        return <p>Loading...</p>
    }

    if (!revealedQuestion) return <p style={{ color: 'crimson' }}>Something went wrong. Question should be revealed</p>

    const playerAnswers = player?.answers || []
    const hasSkippedQuestion = questionId > playerAnswers.length
    const userAnswer = playerAnswers[questionId] ?? null
    const correctAnswer = revealedQuestion.answerVariantId ?? null
    const deadlineExceed = time.moreThan(bnToMs(revealedQuestion.deadline))
    const canAnswer =
        questionKey && correctAnswer == null && userAnswer == null && !deadlineExceed && !hasSkippedQuestion

    return (
        <div>
            <h1>{revealedQuestion.question}</h1>
            <p>[ends at {bnToLocaleString(revealedQuestion.deadline)}]</p>
            <div style={{ border: '1px solid grey', borderRadius: 6, padding: 15 }}>
                <b>your record:</b>
                {questions.map((q, i) => {
                    if (!q.revealedQuestion || q.revealedQuestion.answerVariantId == null) return

                    const userAns = playerAnswers[i]

                    const correctAns = (
                        <span style={{ color: 'limegreen' }}>
                            {q.revealedQuestion.variants[q.revealedQuestion.answerVariantId]}
                        </span>
                    )

                    const wrongAns = <span style={{ color: 'crimson' }}>{userAns == null ? 'skipped' : userAns}</span>

                    return q.revealedQuestion.answerVariantId === userAns ? (
                        <p key={i}>
                            {q.revealedQuestion.question}: {correctAns}
                        </p>
                    ) : (
                        <p key={i}>
                            {q.revealedQuestion.question}: {correctAns} {wrongAns}
                        </p>
                    )
                })}
            </div>
            {deadlineExceed || hasSkippedQuestion ? <p>you can&apos;t answer anymore</p> : null}
            <ol>
                {revealedQuestion.variants.map((variant, index) => {
                    let color = ''
                    if (userAnswer === index) color = correctAnswer == null ? 'yellow' : 'red'
                    if (correctAnswer === index) color = 'limegreen'

                    return (
                        <li key={index} style={{ padding: 5 }}>
                            {canAnswer ? (
                                <button
                                    key={index}
                                    onClick={() => submitAnswer.mutate({ questionKey, variantId: index })}
                                >
                                    {variant}
                                </button>
                            ) : (
                                <span style={{ color, fontWeight: 'bold' }}>{variant}</span>
                            )}
                        </li>
                    )
                })}
            </ol>
        </div>
    )
}
