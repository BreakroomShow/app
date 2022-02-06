import { useEffect, useMemo, useState } from 'react'

import { ResultIcon } from '../components/ResultIcon'
import { Segment } from '../components/Segment'
import { Timer } from '../components/Timer'
import { GameFlowEvent } from '../types'
import { exhaustiveCheck } from '../utils/exhaustiveCheck'
import { selectRandom } from '../utils/selectRandom'
import { RevealedQuestionScreen } from '../views/RevealedQuestionScreen'

interface ReplayManagerProps {
    event: GameFlowEvent
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

export function ReplayManager({
    event,
    currentQuestionId,
    totalQuestions,
    userAnswerId,
    isPlaying,
    speed,
}: ReplayManagerProps) {
    const deadline = useMemo(
        () => Date.now() + event.duration * 1000 + 10,
        [
            event.duration,
            // eslint-disable-next-line react-hooks/exhaustive-deps
            ...[JSON.stringify([event.duration, currentQuestionId, isPlaying])],
        ],
    )

    if (event.type === 'game_info_splash') {
        return (
            <Segment w={4} h={3} color="transparent" inset="lg">
                <p>Sponsor: {event.sponsor_title}</p>
            </Segment>
        )
    }

    if (event.type === 'question') {
        return (
            <Segment color="black" w={4} h={3} inset="lg">
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
                            resultIcon={
                                <Timer key={`${isPlaying}`} speed={speed} active={isPlaying} deadline={deadline} />
                            }
                        />
                    )}
                </UserAnswerProvider>
            </Segment>
        )
    }

    if (event.type === 'answer_reveal') {
        return (
            <Segment color="black" w={4} h={3} inset="lg">
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
            </Segment>
        )
    }

    if (event.type === 'question_fact' || event.type === 'crypto_fact') {
        return (
            <Segment w={4} h={3} color="transparent" inset="lg">
                <p>{event.text}</p>
            </Segment>
        )
    }

    exhaustiveCheck(event)

    return null
}
