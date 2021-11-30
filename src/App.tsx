import '@solana/wallet-adapter-react-ui/styles.css'

import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'

import { useGamesQuery, useTriviaQuery } from './api/query'
import { ConnectionStatus } from './components/ConnectionStatus'
import { CreateGameForm } from './components/CreateGameForm'
import { EditGameForm } from './components/EditGameForm'

function allGameIds(totalGames: number) {
    return Array.from(Array(totalGames).keys())
}

export function App() {
    const wallet = useWallet()

    const { data: trivia } = useTriviaQuery()

    const totalGames = trivia?.gamesCounter
    const gameIds = totalGames == null ? [] : allGameIds(totalGames)
    const { data: allGames = [] } = useGamesQuery(gameIds)

    const [currentGame, setCurrentGame] = useState<number | null>(null)
    const selectedGame = allGames[currentGame!] || null

    return (
        <main style={{ margin: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h1>Clic Trivia</h1>
                    <p>Total games: {totalGames}</p>
                </div>
                <ConnectionStatus />
            </div>

            <div>
                <h2>Create new game</h2>
                {wallet.connected ? <CreateGameForm gameId={trivia?.gamesCounter || 0} /> : null}
            </div>
            <div>
                <h2>Edit game</h2>

                <select
                    value={currentGame == null ? 'none' : currentGame}
                    onChange={(e) => setCurrentGame(e.target.value === 'none' ? null : Number(e.target.value))}
                    style={{ marginBottom: 20 }}
                >
                    <option value="none">none</option>
                    {allGames.map((game, index) => (
                        <option key={index} value={index}>
                            {game.name}
                        </option>
                    ))}
                </select>

                {selectedGame ? <EditGameForm key={currentGame} game={selectedGame} gameId={currentGame!} /> : null}
            </div>
        </main>
    )
}
