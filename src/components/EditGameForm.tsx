import { Game } from 'clic-trivia'
import { useState } from 'react'

import { useAddQuestion, useEditGame } from '../api/mutations'
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

    const editGameMutation = useEditGame(gameId)
    const addQuestionMutation = useAddQuestion(gameId)

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
            <div>
                <h3>Questions</h3>
                {questions.map((q, index) => {
                    const questionKey = game.questionKeys[index]
                    const revealedQuestion = questionKey
                        ? storage.get<{ name: string; variants: string[] }>(questionKey.toString())
                        : null

                    return (
                        <div key={index} style={{ opacity: q.revealedQuestion ? 1 : 0.4 }}>
                            {revealedQuestion ? (
                                <div>
                                    <p>
                                        {index + 1}: {revealedQuestion.name}
                                    </p>
                                    <ul>
                                        {revealedQuestion.variants.map((v) => (
                                            <li key={v}>{v}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <span>{index + 1}: question is corrupted</span>
                            )}
                        </div>
                    )
                })}
            </div>
            <div>
                <h3>Add question</h3>
                <label>
                    question: <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
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
