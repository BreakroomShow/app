import { useMemo } from 'react'

import { useEventListener } from '../api/events'
import { cacheKeys, queryClient, useGamesQuery, useNextGameQuery, useTriviaQuery, useUserQuery } from '../api/query'
import { ConnectionStatus } from '../components/ConnectionStatus'
import { SegmentContainer } from '../components/Segment'
import { ChatView } from '../containers/Chat'
import { useWallet } from '../containers/ConnectProvider'
import { View } from '../containers/View'
import { bnToLocaleString, bnToMs } from '../utils/date'
import { allGameIds } from '../utils/gameIds'
import { QuestionScreen } from '../views/QuestionScreen'

export function UserApp() {
    const wallet = useWallet()

    const { data: user, isLoading: isUserLoading, isIdle: isUserIdle } = useUserQuery()
    const { data: trivia } = useTriviaQuery()
    const { data: allGames = [] } = useGamesQuery(allGameIds(trivia?.gamesCounter || 0))
    const { data: nextGameId = null, isLoading: isNextGameIdLoading, isIdle: isNextGameIdIdle } = useNextGameQuery()

    function reloadGames() {
        queryClient.invalidateQueries(cacheKeys.nextGame)
        queryClient.invalidateQueries(cacheKeys.games)
        queryClient.invalidateQueries(cacheKeys.questions)
    }

    useEventListener('EditGameEvent', reloadGames)
    useEventListener('RevealQuestionEvent', reloadGames)
    useEventListener('RevealAnswerEvent', reloadGames)

    const [prevGame, nextGame] = useMemo(() => {
        if (nextGameId == null) {
            const lastStartedGame = [...allGames].reverse().find((game) => bnToMs(game.startTime) <= Date.now())

            return [lastStartedGame || null, null] as const
        }

        return [allGames[nextGameId - 1] || null, allGames[nextGameId] || null] as const
    }, [allGames, nextGameId])

    return (
        <main style={{ padding: 20 }}>
            <ConnectionStatus app="user" />
            <p>
                {(() => {
                    if (isNextGameIdIdle || isNextGameIdLoading) return <span>Game info loading...</span>

                    const isInProgress = !!nextGame && bnToMs(nextGame.startTime) <= Date.now()

                    if (isInProgress) {
                        return (
                            <span>
                                Game <q>{nextGame.name}</q> just started
                            </span>
                        )
                    }

                    return (
                        <>
                            {prevGame ? (
                                <span>
                                    The last game <q>{prevGame.name}</q> was conducted on{' '}
                                    {bnToLocaleString(prevGame.startTime)}
                                </span>
                            ) : null}
                            {nextGame || prevGame ? <br /> : null}
                            {nextGame ? (
                                <span>
                                    Next game <q>{nextGame.name}</q> starts at {bnToLocaleString(nextGame.startTime)}
                                </span>
                            ) : null}
                        </>
                    )
                })()}
            </p>
            <p style={{ whiteSpace: 'pre-wrap' }}>
                {(() => {
                    if (wallet.status === 'idle') return 'Connect the wallet'
                    if (wallet.isPending) return 'Connecting the wallet...'
                    if (isUserIdle || isUserLoading) return 'User loading...'
                    if (!user) return 'You are not invited yet'
                    // return JSON.stringify({ user, trivia }, null, 4)
                })()}
            </p>
            <button onClick={reloadGames}>Reload Game</button>
            {nextGame && nextGameId != null ? (
                <View>
                    <SegmentContainer>
                        <QuestionScreen gameId={nextGameId} game={nextGame} />
                    </SegmentContainer>
                    <ChatView viewers={0} messages={[]} />
                </View>
            ) : null}
        </main>
    )
}
