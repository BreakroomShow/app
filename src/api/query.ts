import * as anchor from '@project-serum/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import * as trivia from 'clic-trivia'
import { QueryClient, useQuery } from 'react-query'
import axios from 'redaxios'

import { config } from '../config'
import { useCluster } from '../containers/ConnectProvider'
import { Game, Question, UnrevealedQuestion } from '../types'
import { ProgramError } from '../utils/error'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity, // TODO consider inlining it
            retry: 0,
        },
        mutations: {
            onSettled: (_, err) => {
                // TODO graceful errors
                if (err) {
                    if (err instanceof Error) {
                        err = { ...err, _name: err.name, _message: err.message }
                    }

                    // eslint-disable-next-line no-alert
                    alert(JSON.stringify(err, null, 2))
                }
            },
        },
    },
})

export const cacheKeys = {
    provider: 'provider',
    program: 'program',
    triviaPda: 'triviaPda',
    gamePda: 'gamePda',
    playerPda: 'playerPda',
    user: 'user',
    trivia: 'trivia',
    games: 'games',
    questions: 'questions',
    unrevealedQuestions: 'unrevealedQuestions',
    nextGame: 'nextGame',
} as const

const noopPda = [null, null] as const

const unauthorizedWallet: anchor.Provider['wallet'] = {
    publicKey: undefined!,
    signTransaction() {
        throw new ProgramError('Unauthorized')
    },
    signAllTransactions() {
        throw new ProgramError('Unauthorized')
    },
}

export function useWalletPublicKey() {
    return useWallet().publicKey
}

export function useProvider() {
    const walletCtx = useWallet()
    const { connection } = useConnection()
    const [cluster] = useCluster()

    const provider = useQuery([cacheKeys.provider, walletCtx.publicKey, cluster], () => {
        let wallet = unauthorizedWallet

        if (walletCtx.publicKey && walletCtx.signTransaction && walletCtx.signAllTransactions) {
            wallet = {
                publicKey: walletCtx.publicKey,
                signTransaction: walletCtx.signTransaction,
                signAllTransactions: walletCtx.signAllTransactions,
            }
        }

        return new anchor.Provider(connection, wallet, { preflightCommitment: connection.commitment })
    }).data

    const sessionCacheKey = `${cluster}${provider?.wallet?.publicKey}${!!provider}`

    return [provider, sessionCacheKey] as const
}

export function useProgram() {
    const [provider, sessionCacheKey] = useProvider()

    return [
        useQuery(
            [cacheKeys.program, sessionCacheKey],
            () => {
                if (!provider) return

                return new anchor.Program(trivia.IDL, config.programID, provider)
            },
            { enabled: !!provider },
        ).data,
        sessionCacheKey,
    ] as const
}

export function useTriviaPda() {
    return useQuery([cacheKeys.triviaPda], () => trivia.TriviaPDA(config.programID)).data || noopPda
}

export function useGamePda(gameIndices: number[]) {
    const [triviaPda] = useTriviaPda()

    return (
        useQuery([cacheKeys.gamePda, gameIndices, triviaPda], () => {
            if (!triviaPda) return

            return Promise.all(gameIndices.map((gameIndex) => trivia.GamePDA(config.programID, triviaPda, gameIndex)))
        }).data || []
    )
}

export function useGamePdaFor(gameIndex: number) {
    const [pdaResult] = useGamePda([gameIndex])
    return pdaResult || noopPda
}

export function useUserQuery() {
    const [triviaPda] = useTriviaPda()
    const [program, sessionCacheKey] = useProgram()
    const walletPublicKey = useWalletPublicKey()

    return useQuery(
        [cacheKeys.user, walletPublicKey, triviaPda, sessionCacheKey],
        async () => {
            if (!triviaPda) return
            if (!program) return
            if (!walletPublicKey) throw new ProgramError('Unauthorized', 'Connect the wallet')

            const [userPda] = await trivia.UserPDA(config.programID, triviaPda, walletPublicKey)

            return program.account.user.fetch(userPda).catch(() => null)
        },
        {
            enabled: Boolean(program && walletPublicKey),
            keepPreviousData: true,
        },
    )
}

export function usePlayerQuery() {
    const [triviaPda] = useTriviaPda()
    const [program, sessionCacheKey] = useProgram()
    const walletPublicKey = useWalletPublicKey()

    return useQuery(
        [cacheKeys.user, walletPublicKey, triviaPda, sessionCacheKey],
        async () => {
            if (!triviaPda) return
            if (!program) return
            if (!walletPublicKey) throw new ProgramError('Unauthorized', 'Connect the wallet')

            const [playerPda] = await trivia.PlayerPDA(config.programID, triviaPda, walletPublicKey)

            return program.account.player.fetch(playerPda).catch(() => null)
        },
        {
            enabled: Boolean(program && walletPublicKey),
            keepPreviousData: true,
        },
    )
}

export function useTriviaQuery() {
    const [triviaPda, triviaBump] = useTriviaPda()
    const [program, sessionCacheKey] = useProgram()
    const walletPublicKey = useWalletPublicKey()

    return useQuery(
        [cacheKeys.trivia, triviaPda, sessionCacheKey],
        () => {
            if (!triviaPda || !triviaBump) return
            if (!program) return

            const initializeTrivia = () => {
                if (!walletPublicKey) throw new ProgramError('Unauthorized')

                return program.rpc.initialize(triviaBump, {
                    accounts: {
                        trivia: triviaPda,
                        authority: walletPublicKey,
                        systemProgram: anchor.web3.SystemProgram.programId,
                    },
                })
            }

            const fetchTrivia = () => program.account.trivia.fetch(triviaPda)

            return fetchTrivia().catch((err) => {
                if (err?.message.includes('Account does not exist')) {
                    return initializeTrivia().then(fetchTrivia)
                }

                throw err
            })
        },
        {
            enabled: !!program,
            keepPreviousData: true,
        },
    )
}

export function useGamesQuery(gameIndices: number[]) {
    const [program, sessionCacheKey] = useProgram()
    const results = useGamePda(gameIndices)
    const gamePDAs = results.map(([gamePda]) => gamePda)

    return useQuery(
        [cacheKeys.games, gameIndices, gamePDAs, sessionCacheKey],
        () => {
            if (!program) return

            return Promise.all(gamePDAs.map((gamePda) => program.account.game.fetch(gamePda) as Promise<Game>))
        },
        {
            enabled: !!program,
            keepPreviousData: true,
        },
    )
}

export function useQuestionsQuery(
    gameIndex: number /* is used to invalidate questions only for the exact game */,
    questionKeys: anchor.web3.PublicKey[],
) {
    const [program, sessionCacheKey] = useProgram()

    return useQuery(
        [cacheKeys.questions, gameIndex, questionKeys, sessionCacheKey],
        () => {
            if (!program) return

            return Promise.all(
                questionKeys.map((questionKey) => program.account.question.fetch(questionKey) as Promise<Question>),
            )
        },
        {
            enabled: !!program,
            keepPreviousData: true,
        },
    )
}

export function useUnrevealedQuestionsQuery(questionKeys: string[]) {
    return useQuery([cacheKeys.unrevealedQuestions, questionKeys], async () => {
        const result: { [publicKey in UnrevealedQuestion['publicKey']]?: UnrevealedQuestion } = {}

        if (!questionKeys.length) return result

        const { data: questions } = await axios.get<UnrevealedQuestion[]>('/api/unrevealed-questions', {
            params: questionKeys.reduce((params, key) => {
                params.append('questionKeys', key)
                return params
            }, new URLSearchParams()),
        })

        questions.forEach((question) => {
            result[question.publicKey] = question
        })

        return result
    })
}

export function useNextGameQuery() {
    return useQuery(
        [cacheKeys.nextGame],
        async () => {
            const {
                data: { gameId },
            } = await axios<{ gameId: number | null }>('/api/next-game')

            return gameId
        },
        {
            keepPreviousData: true,
        },
    )
}
