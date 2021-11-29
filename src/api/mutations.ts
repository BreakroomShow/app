import * as anchor from '@project-serum/anchor'
import { CreateGameOptions } from 'clic-trivia'
import { EditGameEvent } from 'clic-trivia/types/index'
import { useMutation } from 'react-query'

import { msToBn } from '../utils/date'
import { noopPda, queryClient, useGamePda, useProgram, useTriviaPda } from './query'

interface UseCreateGameOptions {
    name: string
    startTime: number
}

export function useCreateGame(gameIndex: number) {
    const [pdaResult] = useGamePda([gameIndex])
    const [gamePda, gameBump] = pdaResult || noopPda
    const [program, userPublicKey] = useProgram()
    const [triviaPda] = useTriviaPda()

    return useMutation(
        async ({ name, startTime }: UseCreateGameOptions) => {
            if (!triviaPda) return
            if (!gamePda || !gameBump) return
            if (!program || !userPublicKey) return

            const options: CreateGameOptions = {
                name,
                startTime: msToBn(startTime),
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

export function useEditGame(gameIndex: number) {
    const [pdaResult] = useGamePda([gameIndex])
    const [gamePda, gameBump] = pdaResult || noopPda
    const [program, userPublicKey] = useProgram()
    const [triviaPda] = useTriviaPda()

    return useMutation(
        async ({ name, startTime }: UseCreateGameOptions) => {
            if (!triviaPda) return
            if (!gamePda || !gameBump) return
            if (!program || !userPublicKey) return

            const options: CreateGameOptions = {
                name,
                startTime: msToBn(startTime),
            }

            return new Promise<EditGameEvent>((resolve) => {
                const listener = program.addEventListener('EditGameEvent', (event: EditGameEvent) => {
                    program.removeEventListener(listener).then(() => {
                        resolve(event)
                    })
                })

                program.rpc.editGame(options, {
                    accounts: {
                        game: gamePda,
                        authority: userPublicKey,
                    },
                })
            })
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('games')
            },
        },
    )
}
