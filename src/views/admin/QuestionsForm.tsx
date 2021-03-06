import { useRemoveQuestion, useRevealAnswer, useRevealQuestion } from '../../api/mutations'
import { useQuestionsQuery, useUnrevealedQuestionsQuery } from '../../api/query'
import { Typography } from '../../design-system'
import { useTime } from '../../hooks/useTime'
import { Game, StoredQuestionData } from '../../types'
import { bnToLocaleString, bnToMs } from '../../utils/date'

interface QuestionsFormProps {
    gameId: number
    gameStarted: boolean
    questionKeys: Game['questionKeys']
}

export function QuestionsForm({ gameId, questionKeys, gameStarted }: QuestionsFormProps) {
    const nonNullableQuestionKeys = questionKeys.filter((key): key is NonNullable<typeof key> => !!key)

    const { data: questions = [], isLoading } = useQuestionsQuery(gameId, nonNullableQuestionKeys)

    const { data: unrevealedQuestions = {}, isLoading: isUnrevealedQuestionLoading } = useUnrevealedQuestionsQuery(
        nonNullableQuestionKeys.map((questionKey) => questionKey.toString()),
    )

    const revealQuestionMutation = useRevealQuestion(gameId)
    const removeQuestionMutation = useRemoveQuestion(gameId)
    const revealAnswerMutation = useRevealAnswer(gameId)

    const time = useTime()

    return (
        <div>
            <Typography as="h3">Questions</Typography>

            {questions.length || isLoading ? null : <p>No questions yet</p>}

            {questions.map((question, index) => {
                const questionKey = questionKeys[index]

                if (!questionKey) {
                    return (
                        <div key={index}>
                            <span style={{ color: 'crimson' }}>Q{index + 1}: questionPublicKey not found</span>
                        </div>
                    )
                }

                const isQuestionRevealed = !!question.revealedQuestion
                let isAnswerReadyToReveal = false

                const unrevealedQuestion = unrevealedQuestions[questionKey.toString()]

                let questionData: StoredQuestionData

                if (question.revealedQuestion) {
                    isAnswerReadyToReveal = time.moreThan(bnToMs(question.revealedQuestion.deadline))

                    questionData = {
                        name: question.revealedQuestion.question,
                        variants: question.revealedQuestion.variants,
                    }
                } else if (unrevealedQuestion) {
                    questionData = {
                        name: unrevealedQuestion.name,
                        variants: unrevealedQuestion.variants,
                    }
                } else if (isUnrevealedQuestionLoading) {
                    return (
                        <div key={index} style={{ height: 120 }}>
                            <span>Q{index + 1}: Loading ...</span>
                        </div>
                    )
                } else {
                    return (
                        <div key={index}>
                            <span style={{ color: 'crimson' }}>
                                Q{index + 1}: not revealed and no stored data found
                            </span>
                        </div>
                    )
                }

                return (
                    <div key={index} style={{ display: 'flex' }}>
                        <div style={{ opacity: isQuestionRevealed ? 1 : 0.4 }}>
                            <p>
                                Q{index + 1}: {questionData.name}{' '}
                                {isQuestionRevealed ? (
                                    <span style={{ fontSize: 12 }}>
                                        [ends at {bnToLocaleString(question.revealedQuestion!.deadline)}]
                                    </span>
                                ) : (
                                    <span style={{ fontSize: 12 }}>(not revealed)</span>
                                )}
                            </p>
                            <ul>
                                {questionData.variants.map((v, i) => {
                                    const isAnswerRevealed = question.revealedQuestion?.answerVariantId != null
                                    const isCorrect = question.revealedQuestion?.answerVariantId === i

                                    return (
                                        <li key={i} style={isCorrect ? { color: 'limegreen', fontWeight: 'bold' } : {}}>
                                            {v}{' '}
                                            {isQuestionRevealed && isAnswerReadyToReveal && !isAnswerRevealed ? (
                                                <button
                                                    onClick={() => {
                                                        revealAnswerMutation.mutate({ questionKey, variantId: i })
                                                    }}
                                                >
                                                    ??? mark as correct
                                                </button>
                                            ) : null}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
                            {gameStarted ? (
                                <div>
                                    {isQuestionRevealed ? null : (
                                        <button
                                            onClick={() => {
                                                revealQuestionMutation.mutate({
                                                    questionKey,
                                                    name: questionData.name,
                                                    variants: questionData.variants,
                                                })
                                            }}
                                        >
                                            ???? reveal this question ????
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <button onClick={() => removeQuestionMutation.mutate(questionKey)}>
                                        ???? remove this question ????
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
