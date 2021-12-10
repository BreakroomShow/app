import { useWallet } from '@solana/wallet-adapter-react'

import { useGamesQuery, useNextGameQuery, useTriviaQuery, useUserQuery } from '../api/query'
import { ConnectionStatus } from '../components/ConnectionStatus'
import { allGameIds } from '../utils/gameIds'

export function UserApp() {
    const wallet = useWallet()
    const { data: user, isLoading: isUserLoading, isIdle: isUserIdle } = useUserQuery()
    const { data: trivia } = useTriviaQuery()

    const totalGames = trivia?.gamesCounter || 0
    const gameIds = allGameIds(totalGames)

    const { data: allGames = [] } = useGamesQuery(gameIds)

    const { data: nextGameId = null } = useNextGameQuery()

    return (
        <div>
            <ConnectionStatus />
            <p style={{ whiteSpace: 'pre-wrap' }}>
                {(() => {
                    if (!wallet.connected) return 'Connect the wallet'
                    if (isUserIdle || isUserLoading) return 'Loading...'
                    if (!user) return 'You are not invited yet'
                    return JSON.stringify(
                        {
                            nextGameId,
                            user,
                            trivia,
                            game: allGames[0],
                        },
                        null,
                        4,
                    )
                })()}
            </p>
        </div>
    )
}
