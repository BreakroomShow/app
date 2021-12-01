import '@solana/wallet-adapter-react-ui/styles.css'

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'

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
    const lastGameId = totalGames ? totalGames - 1 : null
    useEffect(() => {
        setCurrentGame((prev) => (prev == null ? lastGameId : prev))
    }, [lastGameId])

    const selectedGame = allGames[currentGame!] || null

    return (
        <main style={{ margin: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>Clic Trivia</h1>
                <ConnectionStatus />
            </div>

            <section>
                <h2>Create new game</h2>
                {wallet.connected ? (
                    <CreateGameForm gameId={totalGames || 0} onSuccess={() => setCurrentGame(totalGames || 0)} />
                ) : null}
            </section>

            <section>
                <h2>Edit game</h2>

                <div style={{ display: 'flex' }}>
                    <select
                        value={currentGame == null ? 'none' : currentGame}
                        onChange={(e) => setCurrentGame(e.target.value === 'none' ? null : Number(e.target.value))}
                        style={{ marginBottom: 20 }}
                    >
                        <option value="none">Select game to edit</option>
                        {allGames.map((game, index) => (
                            <option key={index} value={index}>
                                {game.name}
                            </option>
                        ))}
                    </select>
                    <div style={{ padding: '0 20px' }}>total games: {totalGames}</div>
                </div>

                {selectedGame ? <EditGameForm key={currentGame} game={selectedGame} gameId={currentGame!} /> : null}
            </section>
        </main>
    )
}
