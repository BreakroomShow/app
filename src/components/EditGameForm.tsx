import { useEditGame, useStartGame, useUpdateNextGame } from '../api/mutations'
import { useNextGameQuery } from '../api/query'
import { useNonce } from '../hooks/useNonce'
import { Game } from '../types'
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

    const { mutate: editGame, isLoading: isEditInProgress } = useEditGame(gameId)
    const { mutate: startGame, isLoading: isStartInProgress } = useStartGame(gameId)
    const { mutate: updateNext, isLoading: isUpdateInProgress } = useUpdateNextGame()
    const { data: nextGameId = null, isLoading: isNextLoading } = useNextGameQuery()

    const isGameStatusLoading = isNextLoading || isUpdateInProgress || isStartInProgress || isEditInProgress

    let gameStatus:
        | 'future' /* not next, not started */
        | 'next' /* next, not started */
        | 'current' /* next, started */
        | 'past' /* not next, started */ = 'future'

    if (gameId !== nextGameId && !gameStarted) gameStatus = 'future'
    if (gameId === nextGameId && !gameStarted) gameStatus = 'next'
    if (gameId === nextGameId && gameStarted) gameStatus = 'current'
    if (gameId !== nextGameId && gameStarted) gameStatus = 'past'

    return (
        <div>
            <section>
                <p style={{ fontStyle: 'italic' }}>
                    {gameStatus === 'future' ? (
                        <button disabled={isGameStatusLoading} onClick={() => updateNext(gameId)}>
                            plan this game next
                        </button>
                    ) : null}
                    {gameStatus === 'next' ? (
                        <button disabled={isGameStatusLoading} onClick={() => startGame()}>
                            start now
                        </button>
                    ) : null}
                    {gameStatus === 'current' ? (
                        <button disabled={isGameStatusLoading} onClick={() => updateNext(null)}>
                            finish the game
                        </button>
                    ) : null}
                    {gameStatus === 'past' ? 'this game is over or another one has been planned' : null}
                </p>
            </section>
            <section>
                <GameForm
                    name={game.name}
                    time={bnToTimezoneDateString(game.startTime)}
                    onSuccess={(data) => editGame(data)}
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
