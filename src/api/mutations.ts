import * as anchor from '@project-serum/anchor'
import { CreateGameOptions } from 'clic-trivia'
import { EditGameEvent, RevealQuestionEvent } from 'clic-trivia/types/index'
import { useMutation } from 'react-query'

import { msToBn } from '../utils/date'
import { sha256 } from '../utils/sha256'
import { cacheKeys, queryClient, useGamePdaFor, useProgram, useTriviaPda } from './query'
import * as storage from './storage'

interface GameOptions {
    name: string
    startTime: number
}

export function useCreateGame(gameIndex: number) {
    const [gamePda, gameBump] = useGamePdaFor(gameIndex)
    const [program, userPublicKey] = useProgram()
    const [triviaPda] = useTriviaPda()

    return useMutation(
        async ({ name, startTime }: GameOptions) => {
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
                queryClient.invalidateQueries(cacheKeys.gamePda)
                queryClient.invalidateQueries(cacheKeys.trivia)
            },
        },
    )
}

export function useEditGame(gameIndex: number) {
    const [gamePda] = useGamePdaFor(gameIndex)
    const [program, userPublicKey] = useProgram()
    const [triviaPda] = useTriviaPda()

    return useMutation(
        async ({ name, startTime }: GameOptions) => {
            if (!triviaPda) return
            if (!gamePda) return
            if (!program || !userPublicKey) return

            const options: CreateGameOptions = {
                name,
                startTime: msToBn(startTime),
            }

            return new Promise<EditGameEvent>((resolve) => {
                const listener = program.addEventListener('EditGameEvent', async (event: EditGameEvent) => {
                    await program.removeEventListener(listener)
                    resolve(event)
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
                queryClient.invalidateQueries(cacheKeys.games)
            },
        },
    )
}

export interface StoredQuestionData {
    name: string
    variants: string[]
}

export function useAddQuestion(gameIndex: number) {
    const [gamePda] = useGamePdaFor(gameIndex)
    const [program, userPublicKey] = useProgram()

    return useMutation(
        async ({ name, variants }: StoredQuestionData) => {
            if (!gamePda) return
            if (!program || !userPublicKey) return

            const time = 10 // 10 seconds
            const encodedName = sha256(name)
            const encodedVariants = variants.map((v) => sha256(name, v))
            const questionKeypair = anchor.web3.Keypair.generate()
            const publicKey = questionKeypair.publicKey

            // save to local storage so we can reveal them later
            storage.set(publicKey.toString(), { name, variants })

            return program.rpc.addQuestion(encodedName, encodedVariants, new anchor.BN(time), {
                accounts: {
                    game: gamePda,
                    question: publicKey,
                    authority: userPublicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                },
                signers: [questionKeypair],
            })
        },
        {
            onSuccess() {
                queryClient.invalidateQueries(cacheKeys.games) // TODO query games separately
                queryClient.invalidateQueries([cacheKeys.questions, gameIndex])
            },
        },
    )
}

export function useRemoveQuestion(gameIndex: number) {
    const [gamePda] = useGamePdaFor(gameIndex)
    const [program, userPublicKey] = useProgram()

    return useMutation(
        async (questionKey: anchor.web3.PublicKey) => {
            if (!gamePda) return
            if (!program || !userPublicKey) return

            return program.rpc.removeQuestion(questionKey, {
                accounts: {
                    game: gamePda,
                    authority: userPublicKey,
                },
            })
        },
        {
            onSuccess() {
                queryClient.invalidateQueries(cacheKeys.games) // TODO query games separately
                queryClient.invalidateQueries([cacheKeys.questions, gameIndex])
            },
        },
    )
}

interface RevealQuestionOptions extends StoredQuestionData {
    questionKey: anchor.web3.PublicKey
}

export function useRevealQuestion(gameIndex: number) {
    const [gamePda] = useGamePdaFor(gameIndex)
    const [program, userPublicKey] = useProgram()

    return useMutation(
        async ({ questionKey, name, variants }: RevealQuestionOptions) => {
            if (!gamePda) return
            if (!program || !userPublicKey) return

            return new Promise<RevealQuestionEvent>((resolve) => {
                const listener = program.addEventListener('RevealQuestionEvent', async (event: RevealQuestionEvent) => {
                    await program.removeEventListener(listener)
                    resolve(event)
                })

                program.rpc.revealQuestion(name, variants, {
                    accounts: {
                        question: questionKey,
                        game: gamePda,
                        authority: userPublicKey,
                    },
                })
            })
        },
        {
            onSuccess() {
                queryClient.invalidateQueries(cacheKeys.games) // TODO query games separately
                queryClient.invalidateQueries([cacheKeys.questions, gameIndex])
            },
        },
    )
}

export function useStartGame(gameIndex: number) {
    const [gamePda] = useGamePdaFor(gameIndex)
    const [program, userPublicKey] = useProgram()

    return useMutation(
        async () => {
            if (!gamePda) return
            if (!program || !userPublicKey) return

            return new Promise<EditGameEvent>((resolve) => {
                const listener = program.addEventListener('EditGameEvent', async (event: EditGameEvent) => {
                    await program.removeEventListener(listener)
                    resolve(event)
                })

                program.rpc.startGame({
                    accounts: {
                        game: gamePda,
                        authority: userPublicKey,
                    },
                })
            })
        },
        {
            onSuccess() {
                return queryClient.invalidateQueries(cacheKeys.games) // TODO query games separately
            },
        },
    )
}
