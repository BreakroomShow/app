import { Game } from 'clic-trivia'
import { useMemo, useState } from 'react'

import { AddQuestionOptions, useAddQuestion, useEditGame, useRemoveQuestion } from '../api/mutations'
import { useQuestionsQuery } from '../api/query'
import * as storage from '../api/storage'
import { bnToDateString } from '../utils/date'
import { GameForm } from './GameForm'

interface EditGameFormProps {
    gameId: number
    game: Game
}

export function EditGameForm({ gameId, game }: EditGameFormProps) {
    const { data: questions = [] } = useQuestionsQuery(gameId, game.questionKeys)

    const questionsData = useMemo(() => {
        return questions.map((_, index) => {
            const questionKey = game.questionKeys[index]
            return questionKey ? storage.get<AddQuestionOptions>(questionKey.toString()) : null
        })
    }, [game.questionKeys, questions])

    const editGameMutation = useEditGame(gameId)
    const addQuestionMutation = useAddQuestion(gameId)
    const removeQuestionMutation = useRemoveQuestion(gameId)

    const [question, setQuestion] = useState('')
    const [answers, setAnswers] = useState<[string, string, string]>(['', '', '']) // always 3

    const validQuestion = question.trim()
    const validAnswers = answers.map((a) => a.trim())

    function addQuestion() {
        addQuestionMutation.mutate(
            { name: validQuestion, variants: validAnswers },
            {
                onSuccess() {
                    setQuestion('')
                    setAnswers(['', '', ''])
                },
            },
        )
    }

    return (
        <div>
            <GameForm
                name={game.name}
                time={bnToDateString(game.startTime)}
                onSuccess={(data) => editGameMutation.mutate(data)}
            />
            <section>
                <h3>Questions</h3>
                {questions.map((q, index) => {
                    const questionKey = game.questionKeys[index]
                    const questionData = questionsData[index] || null

                    return (
                        <div key={index} style={{ display: 'flex' }}>
                            {questionData ? (
                                <div style={{ opacity: q.revealedQuestion ? 1 : 0.4 }}>
                                    <p>
                                        Q{index + 1}: {questionData.name}{' '}
                                        {q.revealedQuestion ? null : (
                                            <span style={{ fontSize: 12 }}>(not revealed)</span>
                                        )}
                                    </p>
                                    <ul>
                                        {questionData.variants.map((v) => (
                                            <li key={v}>{v}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <span>{index + 1}: question is corrupted</span>
                            )}
                            <div style={{ padding: 20 }}>
                                {questionKey ? (
                                    <button onClick={() => removeQuestionMutation.mutate(questionKey)}>
                                        [X] remove this question
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    )
                })}
            </section>
            <div>
                <h3>Add a question</h3>
                <label>
                    Question: <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
                </label>
            </div>
            {answers.map((answer, index) => {
                const setAnswer = (value: string) => {
                    setAnswers((prev) => {
                        const next: typeof prev = [...prev]
                        next[index] = value
                        return next
                    })
                }

                return (
                    <div key={index}>
                        <label>
                            answer {index + 1}:{' '}
                            <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} />
                        </label>
                    </div>
                )
            })}
            <button onClick={addQuestion} disabled={!validQuestion || !validAnswers.every(Boolean)}>
                send
            </button>
        </div>
    )
}
