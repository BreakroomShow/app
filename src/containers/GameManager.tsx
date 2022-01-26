import { ResultIcon } from '../components/ResultIcon'
import { Timer } from '../components/Timer'
import { GameEvent } from '../types'
import { exhaustiveCheck } from '../utils/exhaustiveCheck'
import { RevealedQuestionScreen } from '../views/RevealedQuestionScreen'

interface GameManagerProps {
    event: GameEvent
    currentQuestionId: number
    totalQuestions: number
    isPlaying: boolean
}

// TODO real stats
const answered = 1
const lives = 1
const fund = 1

export function GameManager({ event, currentQuestionId, totalQuestions, isPlaying }: GameManagerProps) {
    if (event.type === 'game_info_splash') {
        return <p>Game Splash screen</p>
    }

    if (event.type === 'question') {
        return (
            <RevealedQuestionScreen
                key={event.type}
                questionId={currentQuestionId}
                totalQuestions={totalQuestions}
                questionText={event.question}
                answers={event.answers}
                userAnswer={null}
                correctAnswer={null}
                answerCount={null}
                answered={answered}
                lives={lives}
                fund={fund}
                resultIcon={
                    <Timer
                        key={String(isPlaying)}
                        active={isPlaying}
                        deadline={Date.now() + event.duration * 1000 + 1}
                    />
                }
            />
        )
    }

    if (event.type === 'answer_reveal') {
        return (
            <RevealedQuestionScreen
                key={event.type}
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
