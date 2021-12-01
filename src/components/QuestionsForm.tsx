import { Game } from 'clic-trivia'
import { useMemo } from 'react'

import { useRemoveQuestion, useRevealAnswer, useRevealQuestion } from '../api/mutations'
import { useQuestionsQuery } from '../api/query'
import * as storage from '../api/storage'
import { StoredQuestionData } from '../api/types'
import { useNonce } from '../hooks/useNonce'
import { bnToLocaleString, bnToMs } from '../utils/date'
import { logError } from '../utils/logError'

interface QuestionsFormProps {
    gameId: number
    gameStarted: boolean
    questionKeys: Game['questionKeys']
}

export function QuestionsForm({ gameId, questionKeys, gameStarted }: QuestionsFormProps) {
    const { data: questions = [], isLoading } = useQuestionsQuery(gameId, questionKeys)

    const revealQuestionMutation = useRevealQuestion(gameId)
    const removeQuestionMutation = useRemoveQuestion(gameId)
    const revealAnswerMutation = useRevealAnswer(gameId)

    const questionsData = useMemo(() => {
        return questions.map((_, index) => {
            const questionKey = questionKeys[index]
            return questionKey ? storage.get<StoredQuestionData>(questionKey.toString()) : null
        })
    }, [questionKeys, questions])

    const nonce = useNonce()

    return (
        <div>
            <h3>Questions</h3>

            {questions.length || isLoading ? null : <p>No questions yet</p>}

            {questions.map((question, index) => {
                const questionKey = questionKeys[index]

                const error = (
                    <div key={index}>
                        <span style={{ color: 'crimson' }}>Q{index + 1}: question is corrupted</span>
                    </div>
                )

                if (!questionKey) return error

                const isQuestionRevealed = !!question.revealedQuestion
                let isReadyToReveal = false

                const storedQuestion = questionsData[index]
                let questionData: StoredQuestionData

                if (question.revealedQuestion) {
                    isReadyToReveal = bnToMs(question.revealedQuestion.deadline) <= nonce

                    questionData = {
                        name: question.revealedQuestion.question,
                        variants: question.revealedQuestion.variants,
                    }
                } else if (storedQuestion) {
                    questionData = { ...storedQuestion }
                } else {
                    logError(
                        `Question #${index + 1} of game #${gameId + 1} is not revealed and no stored data was found`,
                    )
                    return error
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
                                    const isAnswerRevealed = !!question.revealedQuestion?.answerVariantId
                                    const isCorrect = question.revealedQuestion?.answerVariantId === i

                                    return (
                                        <li key={v} style={isCorrect ? { color: 'limegreen', fontWeight: 'bold' } : {}}>
                                            {v}{' '}
                                            {isQuestionRevealed && isReadyToReveal && !isAnswerRevealed ? (
                                                <button
                                                    onClick={() => {
                                                        revealAnswerMutation.mutate({ questionKey, variantId: i })
                                                    }}
                                                >
                                                    ✔ mark as correct
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
                                            👀 reveal this question 🎬
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <button onClick={() => removeQuestionMutation.mutate(questionKey)}>
                                        🧹 remove this question 🗑
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
