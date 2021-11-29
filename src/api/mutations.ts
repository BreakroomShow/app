import * as anchor from '@project-serum/anchor'
import { CreateGameOptions } from 'clic-trivia'
import { useMutation } from 'react-query'

import { queryClient, useGamePda, useProgram, useTriviaPda } from './query'

interface UseCreateGameOptions {
    name: string
    startTime: number
}

export function useCreateGame(gameIndex: number) {
    const [gamePda, gameBump] = useGamePda(gameIndex)
    const [program, userPublicKey] = useProgram()
    const [triviaPda] = useTriviaPda()

    return useMutation(
        async ({ name, startTime }: UseCreateGameOptions) => {
            if (!triviaPda) return
            if (!gamePda || !gameBump) return
            if (!program || !userPublicKey) return

            const options: CreateGameOptions = {
                name,
                startTime: new anchor.BN(startTime),
            }

            return program.rpc.createGame(options, gameBump, {
                accounts: {
                    trivia: triviaPda,
                    game: gamePda,
                    authority: userPublicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                },
            })
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('gamePda')
                queryClient.invalidateQueries('trivia')
            },
        },
    )
}
