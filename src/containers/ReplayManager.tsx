import { useEffect, useMemo, useState } from 'react'

import { Confetti } from '../components/Confetti'
import { ResultIcon } from '../components/ResultIcon'
import { Segment } from '../components/Segment'
import { Timer } from '../components/Timer'
import { useReplay } from '../pages/Replay'
import { GameFlowEvent } from '../types'
import { exhaustiveCheck } from '../utils/exhaustiveCheck'
import { selectRandom } from '../utils/selectRandom'
import { RevealedQuestionView } from '../views/RevealedQuestionView'

interface ReplayManagerProps {
    event: GameFlowEvent
    currentQuestionId: number
    userAnswerId: number
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

export function ReplayManager({ event, currentQuestionId, userAnswerId }: ReplayManagerProps) {
    const { isPlaying, speed } = useReplay()

    const deadline = useMemo(
        () => Date.now() + event.duration * 1000 + 10,
        [
            event.duration,
            // eslint-disable-next-line react-hooks/exhaustive-deps
            ...[JSON.stringify([event.duration, currentQuestionId, isPlaying])],
        ],
    )

    const placeholder = (
        <Segment w={4} h={3} color="transparent" inset="lg">
            {null}
        </Segment>
    )

    if (event.type === 'game_info_splash') {
        return placeholder
    }

    if (event.type === 'question') {
        return (
            <Segment color="black" w={4} h={3} inset="lg">
                <UserAnswerProvider userAnswer={isPlaying ? userAnswerId : null}>
                    {(userAnswer) => (
                        <RevealedQuestionView
                            questionId={currentQuestionId}
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
                <Confetti />
                <RevealedQuestionView
                    questionId={currentQuestionId}
                    questionText={event.question.question}
                    answers={event.question.answers}
                    userAnswer={event.correct_answer_ind}
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

    if (event.type === 'question_fact' || event.type === 'crypto_fact' || event.type === 'intro_splash') {
        return placeholder
    }

    exhaustiveCheck(event)

    return null
}
