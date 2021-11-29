import * as anchor from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import * as solana from '@solana/web3.js'
import { Game, GamePDA, PlayerPDA, TriviaIdl, TriviaPDA } from 'clic-trivia'
import { QueryClient, useQuery } from 'react-query'

import { network, preflightCommitment, programID, triviaIdl } from '../config'

export const noopPda = [null, null] as const

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // TODO consider inlining it
            staleTime: Infinity,
        },
    },
})

export function useProvider() {
    const wallet = useWallet()

    const provider = useQuery(['provider', wallet.publicKey], () => {
        return new anchor.Provider(
            new solana.Connection(network, preflightCommitment),
            wallet as unknown as anchor.Wallet,
            { preflightCommitment },
        )
    }).data

    return [provider, provider?.wallet.publicKey] as const
}

export function useProgram() {
    const [provider, userPublicKey] = useProvider()

    return [
        useQuery(
            ['program', userPublicKey],
            () => {
                if (!provider) return

                return new anchor.Program<TriviaIdl>(triviaIdl, programID, provider)
            },
            { enabled: !!provider },
        ).data,
        userPublicKey,
    ] as const
}

export function useTriviaPda() {
    return useQuery(['triviaPda'], () => TriviaPDA(programID)).data || noopPda
}

export function useGamePda(gameIndices: number[]) {
    const [triviaPda] = useTriviaPda()

    return (
        useQuery(['gamePda', gameIndices, triviaPda], () => {
            if (!triviaPda) return

            return Promise.all(gameIndices.map((gameIndex) => GamePDA(programID, triviaPda, gameIndex)))
        }).data || []
    )
}

export function usePlayerPda() {
    const [triviaPda] = useTriviaPda()
    const [, userPublicKey] = useProvider()

    return (
        useQuery(['playerPda', userPublicKey, triviaPda], () => {
            if (!triviaPda) return
            if (!userPublicKey) return

            return PlayerPDA(programID, triviaPda, userPublicKey)
        }).data || noopPda
    )
}

export function useGamesQuery(gameIndices: number[]) {
    const [program, userPublicKey] = useProgram()
    const results = useGamePda(gameIndices)
    const gamePDAs = results.map(([gamePda]) => gamePda)

    return useQuery(
        ['games', gameIndices, gamePDAs, userPublicKey],
        () => {
            if (!program) return

            return Promise.all(gamePDAs.map((gamePda) => program.account.game.fetch(gamePda) as Promise<Game>))
        },
        { enabled: !!program },
    )
}

export function useTriviaQuery() {
    const [triviaPda] = useTriviaPda()
    const [program, userPublicKey] = useProgram()

    return useQuery(
        ['trivia', triviaPda, userPublicKey],
        () => {
            if (!triviaPda) return
            if (!program) return

            return program.account.trivia.fetch(triviaPda)
        },
        { enabled: !!program },
    )
}
