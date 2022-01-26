import { useEffect, useState } from 'react'

import { ResultIcon } from '../components/ResultIcon'
import { Timer } from '../components/Timer'
import { GameEvent } from '../types'
import { exhaustiveCheck } from '../utils/exhaustiveCheck'
import { selectRandom } from '../utils/selectRandom'
import { RevealedQuestionScreen } from '../views/RevealedQuestionScreen'

interface GameManagerProps {
    event: GameEvent
    currentQuestionId: number
    totalQuestions: number
    userAnswerId: number
    isPlaying: boolean
    speed: number
}

// TODO real stats
const answered = 1
const lives = 1
const fund = 1

function UserAnswerProvider({
    children,
    userAnswer,
}: {
    userAnswer: number | null
    children(answer: number | null): JSX.Element
}) {
    const [userAnswerId, setUserAnswerId] = useState<number | null>(null)

    useEffect(() => {
        if (userAnswer == null) {
            setUserAnswerId(null)
            return
        }

        const timer = setTimeout(() => {
            setUserAnswerId(userAnswer)
        }, selectRandom([2, 3, 4]) * 1000)

        return () => clearTimeout(timer)
    }, [userAnswer])

    return children(userAnswerId)
}

export function GameManager({
    event,
    currentQuestionId,
    totalQuestions,
    userAnswerId,
    isPlaying,
    speed,
}: GameManagerProps) {
    if (event.type === 'game_info_splash') {
        return <p>Game Splash screen</p>
    }

    if (event.type === 'question') {
        const deadline = Date.now() + event.duration * 1000 + 10

        return (
            <UserAnswerProvider userAnswer={isPlaying ? userAnswerId : null}>
                {(userAnswer) => (
                    <RevealedQuestionScreen
                        questionId={currentQuestionId}
                        totalQuestions={totalQuestions}
                        questionText={event.question}
                        answers={event.answers}
                        userAnswer={userAnswer}
                        correctAnswer={null}
                        answerCount={null}
                        answered={answered}
                        lives={lives}
                        fund={fund}
                        resultIcon={<Timer key={`${isPlaying}`} speed={speed} active={isPlaying} deadline={deadline} />}
                    />
                )}
            </UserAnswerProvider>
        )
    }

    if (event.type === 'answer_reveal') {
        return (
            <RevealedQuestionScreen
                questionId={currentQuestionId}
                totalQuestions={totalQuestions}
                questionText={event.question.question}
                answers={event.question.answers}
                userAnswer={null}
                correctAnswer={event.correct_answer_ind}
                answerCount={event.answer_count}
                answered={answered}
                lives={lives}
                fund={fund}
                resultIcon={<ResultIcon variant="correct" />}
            />
        )
    }

    if (event.type === 'question_fact') {
        return <p>Question Fact screen</p>
    }

    if (event.type === 'crypto_fact') {
        return <p>Crypto Fact screen</p>
    }

    exhaustiveCheck(event)

    return null
}
