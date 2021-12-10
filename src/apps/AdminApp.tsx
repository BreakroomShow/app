import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'

import { useWhitelistUser } from '../api/mutations'
import { useGamesQuery, useTriviaQuery } from '../api/query'
import { ConnectionStatus } from '../components/ConnectionStatus'
import { CreateGameForm } from '../components/CreateGameForm'
import { EditGameForm } from '../components/EditGameForm'
import { allGameIds } from '../utils/gameIds'

export function AdminApp() {
    const wallet = useWallet()

    const { data: trivia, isIdle: isTriviaIdle, isLoading: isTriviaLoading } = useTriviaQuery()

    const totalGames = trivia?.gamesCounter || 0
    const gameIds = allGameIds(totalGames)

    const { data: allGames = [], isIdle: isGamesIdle, isLoading: isGamesLoading } = useGamesQuery(gameIds)

    const isLoading = isTriviaIdle || isGamesIdle || isTriviaLoading || isGamesLoading

    const [currentGame, setCurrentGame] = useState<number | null>(null)
    const lastGameId = totalGames ? totalGames - 1 : null
    useEffect(() => {
        setCurrentGame((prev) => (prev == null ? lastGameId : prev))
    }, [lastGameId])

    const selectedGame = allGames[currentGame!] || null

    const whitelistUserMutation = useWhitelistUser()

    return (
        <main style={{ margin: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>Clic Trivia</h1>
                <ConnectionStatus />
            </div>

            {wallet.connected ? (
                <section>
                    <h2>Create new game</h2>
                    <CreateGameForm gameId={totalGames} onSuccess={() => setCurrentGame(totalGames)} />
                    <h2>Whitelist the user</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()

                            const form = e.currentTarget
                            const input = form.elements.namedItem('wallet') as HTMLInputElement

                            whitelistUserMutation.mutate(input.value, {
                                onSuccess: () => form.reset(),
                            })
                        }}
                    >
                        <label>
                            wallet: <input name="wallet" placeholder="0x" type="text" />
                        </label>
                        <button>whitelist!</button>
                    </form>
                </section>
            ) : null}

            {isLoading ? (
                <div style={{ padding: 20 }}>Loading...</div>
            ) : (
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
                                    {index + 1}. {game.name}
                                </option>
                            ))}
                        </select>
                        <div style={{ padding: '0 20px' }}>total games: {totalGames}</div>
                    </div>

                    {selectedGame ? <EditGameForm key={currentGame} game={selectedGame} gameId={currentGame!} /> : null}
                </section>
            )}
        </main>
    )
}
