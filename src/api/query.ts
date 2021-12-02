import * as anchor from '@project-serum/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Answer, Game, GamePDA, PlayerPDA, Question, TriviaIdl, TriviaPDA } from 'clic-trivia'
import { QueryClient, useQuery } from 'react-query'

import { programID, triviaIdl } from '../config/config'
import { useCluster } from '../containers/ConnectProvider'
import { ProgramError } from '../utils/error'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity, // TODO consider inlining it
            retry: 0,
        },
    },
})

export const cacheKeys = {
    provider: 'provider',
    program: 'program',
    triviaPda: 'triviaPda',
    gamePda: 'gamePda',
    playerPda: 'playerPda',
    trivia: 'trivia',
    games: 'games',
    questions: 'questions',
    answers: 'answers',
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

                return new anchor.Program<TriviaIdl>(triviaIdl, programID, provider)
            },
            { enabled: !!provider },
        ).data,
        sessionCacheKey,
    ] as const
}

export function useTriviaPda() {
    return useQuery([cacheKeys.triviaPda], () => TriviaPDA(programID)).data || noopPda
}

export function useGamePda(gameIndices: number[]) {
    const [triviaPda] = useTriviaPda()

    return (
        useQuery([cacheKeys.gamePda, gameIndices, triviaPda], () => {
            if (!triviaPda) return

            return Promise.all(gameIndices.map((gameIndex) => GamePDA(programID, triviaPda, gameIndex)))
        }).data || []
    )
}

export function useGamePdaFor(gameIndex: number) {
    const [pdaResult] = useGamePda([gameIndex])
    return pdaResult || noopPda
}

export function usePlayerPda() {
    const [triviaPda] = useTriviaPda()
    const wallet = useWallet()

    return (
        useQuery([cacheKeys.playerPda, wallet.publicKey, triviaPda], () => {
            if (!triviaPda) return
            if (!wallet.publicKey) return

            return PlayerPDA(programID, triviaPda, wallet.publicKey)
        }).data || noopPda
    )
}

export function useTriviaQuery() {
    const [triviaPda] = useTriviaPda()
    const [program, sessionCacheKey] = useProgram()

    return useQuery(
        [cacheKeys.trivia, triviaPda, sessionCacheKey],
        () => {
            if (!triviaPda) return
            if (!program) return

            return program.account.trivia.fetch(triviaPda)
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

export function useAnswersQuery(
    gameIndex: number /* is used to invalidate answers only for the exact game */,
    questionAnswerKeys: anchor.web3.PublicKey[][],
) {
    const [program, sessionCacheKey] = useProgram()

    return useQuery(
        [cacheKeys.answers, gameIndex, questionAnswerKeys, sessionCacheKey],
        () => {
            if (!program) return

            return Promise.all(
                questionAnswerKeys.map((answerKeys) => {
                    return Promise.all(
                        answerKeys.map((answerKey) => {
                            return program.account.answer.fetch(answerKey) as Promise<Answer>
                        }),
                    )
                }),
            )
        },
        { enabled: !!program },
    )
}
