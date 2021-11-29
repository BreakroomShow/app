import '@solana/wallet-adapter-react-ui/styles.css'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Game } from 'clic-trivia'
import { useState } from 'react'

import { useCreateGame, useEditGame } from './api/mutations'
import { useGamesQuery, useTriviaQuery } from './api/query'
import { bnToDateString, dateStringToMs } from './utils/date'

function ConnectedApp() {
    const wallet = useWallet()

    return (
        <div>
            <div>{String(wallet.publicKey)}</div>
            <br />
            <div>
                <button onClick={() => wallet.disconnect()}>disconnect</button>
            </div>
        </div>
    )
}

function DisconnectedApp() {
    return (
        <div>
            <WalletMultiButton />
        </div>
    )
}

function Connection() {
    const wallet = useWallet()
    if (wallet.connected) return <ConnectedApp />
    if (wallet.connecting) return null
    return <DisconnectedApp />
}

function GameForm({ game, gameId }: { game: Game; gameId: number }) {
    const [name, setName] = useState(game.name)
    const [time, setTime] = useState(bnToDateString(game.startTime))

    const editGameMutation = useEditGame(gameId)

    function save() {
        const validTime = time && dateStringToMs(time)
        const validName = name.trim()

        if (!validTime || !validName) {
            alert('Invalid params')
            return
        }

        return editGameMutation.mutate({ name: validName, startTime: validTime })
    }

    return (
        <div>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <br />
            <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
            <br />
            <button onClick={save}>save</button>
        </div>
    )
}

function renderObject(object: object | null = null) {
    return <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(object, null, 4)}</div>
}

export function App() {
    const wallet = useWallet()

    const { data: trivia, status: triviaStatus } = useTriviaQuery()

    const gameIds = trivia?.gamesCounter == null ? [] : Array.from(Array(trivia?.gamesCounter).keys())
    const { data: allGames = [] } = useGamesQuery(gameIds)

    const createGameMutation = useCreateGame(trivia?.gamesCounter || 0)

    function createGame() {
        createGameMutation.mutate({
            name: 'brand new game #3',
            startTime: new Date().getTime() + 60 * 1000,
        })
    }

    const [currentGame, setCurrentGame] = useState<number | null>(null)
    const selectedGame = allGames[currentGame!] || null

    return (
        <div>
            <Connection />
            <br />
            <div>
                trivia: {triviaStatus} {renderObject(trivia)}
            </div>
            <br />
            <select
                value={currentGame == null ? 'select' : currentGame}
                onChange={(e) => setCurrentGame(e.target.value === 'select' ? null : Number(e.target.value))}
            >
                <option value="select">Select the game</option>
                {allGames.map((game, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <option key={index} value={index}>
                        {game.name}
                    </option>
                ))}
            </select>
            <br />
            <div>
                current game:{' '}
                {selectedGame && currentGame != null ? (
                    <GameForm key={currentGame} game={selectedGame} gameId={currentGame} />
                ) : (
                    'N/A'
                )}
            </div>
            <br />
            {wallet.connected ? (
                <div>
                    <button onClick={createGame}>create game</button>
                </div>
            ) : null}
        </div>
    )
}
