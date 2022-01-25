import { GameEvent } from '../types'
import { exhaustiveCheck } from '../utils/exhaustiveCheck'

interface GameManagerProps {
    event: GameEvent
}

export function GameManager({ event }: GameManagerProps) {
    if (event.type === 'game_info_splash') {
        return <p>Game Splash screen</p>
    }

    if (event.type === 'question') {
        return <p>Question screen</p>
    }

    if (event.type === 'answer_reveal') {
        return <p>Answered question screen</p>
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
