import { Game } from 'clic-trivia'

import { useEditGame, useStartGame } from '../api/mutations'
import { useNonce } from '../hooks/useNonce'
import { bnToMs, bnToTimezoneDateString } from '../utils/date'
import { AddQuestionForm } from './AddQuestionForm'
import { GameForm } from './GameForm'
import { QuestionsForm } from './QuestionsForm'

interface EditGameFormProps {
    gameId: number
    game: Game
}

export function EditGameForm({ gameId, game }: EditGameFormProps) {
    const nonce = useNonce()
    const gameStarted = bnToMs(game.startTime) <= nonce

    const editGameMutation = useEditGame(gameId)
    const startGameMutation = useStartGame(gameId)

    return (
        <div>
            <section>
                <p>
                    game started : {gameStarted ? 'yes' : 'no'}{' '}
                    {gameStarted ? null : <button onClick={() => startGameMutation.mutate()}>start now</button>}
                </p>
            </section>
            <section>
                <GameForm
                    name={game.name}
                    time={bnToTimezoneDateString(game.startTime)}
                    onSuccess={(data) => editGameMutation.mutate(data)}
                    disabled={gameStarted}
                />
            </section>
            <section>
                <QuestionsForm gameId={gameId} questionKeys={game.questionKeys} gameStarted={gameStarted} />
            </section>
            {gameStarted ? null : (
                <section>
                    <AddQuestionForm gameId={gameId} />
                </section>
            )}
        </div>
    )
}
