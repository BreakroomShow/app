import { useSubmitAnswer } from '../api/mutations'
import { useQuestionsQuery } from '../api/query'
import { Game } from '../types'
import { bnToLocaleString } from '../utils/date'

interface QuestionsScreenProps {
    gameId: number
    game: Game
}

export function QuestionScreen({ gameId, game }: QuestionsScreenProps) {
    const nonNullableQuestionKeys = game.questionKeys.filter((key): key is NonNullable<typeof key> => !!key)

    const { data: questions = [], isLoading, isIdle } = useQuestionsQuery(gameId, nonNullableQuestionKeys)
    const submitAnswer = useSubmitAnswer(gameId)

    const questionId = game.revealedQuestionsCounter ? game.revealedQuestionsCounter - 1 : null

    if (questionId == null) return <p style={{ color: '#66bb6a', fontStyle: 'italic' }}>First question coming soon</p>

    const revealedQuestion = questions[questionId]?.revealedQuestion || null

    const questionKey = game.questionKeys[questionId]

    if (isLoading || isIdle) return <p>Loading...</p>

    if (!questionKey) return <p style={{ color: 'crimson' }}>question PublicKey not found</p>
    if (!revealedQuestion) return <p style={{ color: 'crimson' }}>Something went wrong. Question should be revealed</p>

    return (
        <div>
            <h1>{revealedQuestion.question}</h1>
            <p>[ends at {bnToLocaleString(revealedQuestion.deadline)}]</p>
            <ol>
                {revealedQuestion.variants.map((variant, index) => (
                    <li key={index} style={{ padding: 5 }}>
                        {revealedQuestion.answerVariantId == null ? (
                            <button
                                key={index}
                                onClick={() => {
                                    submitAnswer.mutate({ questionKey, variantId: index })
                                }}
                            >
                                {variant}
                            </button>
                        ) : (
                            <span
                                style={{
                                    color: revealedQuestion.answerVariantId === index ? 'limegreen' : '',
                                    fontWeight: 'bold',
                                }}
                            >
                                {variant}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    )
}
