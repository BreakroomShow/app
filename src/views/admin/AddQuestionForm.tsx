import { useState } from 'react'

import { useAddQuestion } from '../../api/mutations'
import { Typography } from '../../design-system'

interface Props {
    gameId: number
}

export function AddQuestionForm({ gameId }: Props) {
    const [question, setQuestion] = useState('')
    const [answers, setAnswers] = useState<[string, string, string]>(['', '', ''])
    const [time, setTime] = useState(10)

    const validQuestion = question.trim()
    const validAnswers = answers.map((a) => a.trim())

    const addQuestionMutation = useAddQuestion(gameId)

    function addQuestion() {
        addQuestionMutation.mutate(
            { name: validQuestion, variants: validAnswers, time },
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
            <div>
                <Typography as="h3">Add a question</Typography>
                <label>
                    Question: <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
                </label>
            </div>
            <br />
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
            <br />
            <div>
                <label>
                    time to answer:{' '}
                    <input
                        type="number"
                        placeholder="seconds"
                        min={10}
                        value={time}
                        onChange={(e) => setTime(Number(e.target.value))}
                    />{' '}
                    (sec)
                </label>
            </div>
            <br />
            <button onClick={addQuestion} disabled={!validQuestion || !validAnswers.every(Boolean) || time < 10}>
                send
            </button>
        </div>
    )
}
