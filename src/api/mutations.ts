import * as anchor from '@project-serum/anchor'
import * as trivia from 'clic-trivia'
import { useRef } from 'react'
import { useMutation } from 'react-query'
import axios from 'redaxios'

import { GameOptions, StoredQuestionData } from '../types'
import { msToBn, secToBn } from '../utils/date'
import { ProgramError } from '../utils/error'
import { sha256 } from '../utils/sha256'
import { cacheKeys, queryClient, useGamePdaFor, useProgram, useTriviaPda, useWalletPublicKey } from './query'

export function useCreateGame(gameIndex: number) {
    const [gamePda, gameBump] = useGamePdaFor(gameIndex)
    const [program] = useProgram()
    const [triviaPda] = useTriviaPda()
    const walletPublicKey = useWalletPublicKey()

    return useMutation(
        async ({ name, startTime }: GameOptions) => {
            if (!triviaPda) return
            if (!gamePda || !gameBump) return
            if (!program) return
            if (!walletPublicKey) throw new ProgramError('Unauthorized')

            const options: trivia.CreateGameOptions = {
                name,
                startTime: msToBn(startTime),
            }

            return program.rpc.createGame(options, gameBump, {
                accounts: {
                    trivia: triviaPda,
                    game: gamePda,
                    authority: walletPublicKey,
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
    const [program] = useProgram()
    const [triviaPda] = useTriviaPda()
    const walletPublicKey = useWalletPublicKey()

    return useMutation(
        async ({ name, startTime }: GameOptions) => {
            if (!triviaPda) return
            if (!gamePda) return
            if (!program) return
            if (!walletPublicKey) throw new ProgramError('Unauthorized')

            const options: trivia.CreateGameOptions = {
                name,
                startTime: msToBn(startTime),
            }

            return new Promise<trivia.EditGameEvent>((resolve) => {
                const listener = program.addEventListener('EditGameEvent', async (event: trivia.EditGameEvent) => {
                    await program.removeEventListener(listener)
                    resolve(event)
                })

                program.rpc.editGame(options, {
                    accounts: {
                        game: gamePda,
                        authority: walletPublicKey,
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

interface AddQuestionOptions extends StoredQuestionData {
    time: number // sec
}

export function useAddQuestion(gameIndex: number) {
    const [gamePda] = useGamePdaFor(gameIndex)
    const [program] = useProgram()
    const walletPublicKey = useWalletPublicKey()

    const questionPublicKeyRef = useRef<string | null>(null)

    return useMutation(
        async ({ name, variants, time }: AddQuestionOptions) => {
            if (!gamePda) return
            if (!program) return
            if (!walletPublicKey) throw new ProgramError('Unauthorized')

            const timeBn = secToBn(time)
            const encodedName = sha256(name)
            const encodedVariants = variants.map((v) => sha256(name, v))
            const questionKeypair = anchor.web3.Keypair.generate()
            const publicKey = questionKeypair.publicKey
            const questionPublicKey = publicKey.toString()

            // save to db so we can reveal them later
            await axios.post('/api/unrevealed-questions', {
                publicKey: questionPublicKey,
                name,
                variants,
            })

            questionPublicKeyRef.current = questionPublicKey

            return program.rpc.addQuestion(encodedName, encodedVariants, timeBn, {
                accounts: {
                    game: gamePda,
                    question: publicKey,
                    authority: walletPublicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                },
                signers: [questionKeypair],
            })
        },
        {
            onSuccess() {
                return Promise.all([
                    queryClient.invalidateQueries(cacheKeys.games), // TODO query games separately
                    queryClient.invalidateQueries([cacheKeys.questions, gameIndex]),
                    queryClient.invalidateQueries(cacheKeys.unrevealedQuestions),
                ])
            },
            onError() {
                if (!questionPublicKeyRef.current) return

                // delete from db if can't add
                return axios.delete('/api/unrevealed-questions', {
                    params: { questionKey: questionPublicKeyRef.current },
                })
            },
        },
    )
}

export function useRemoveQuestion(gameIndex: number) {
    const [gamePda] = useGamePdaFor(gameIndex)
    const [program] = useProgram()
    const walletPublicKey = useWalletPublicKey()

    return useMutation(
        async (questionKey: anchor.web3.PublicKey) => {
            if (!gamePda) return
            if (!program) return
            if (!walletPublicKey) throw new ProgramError('Unauthorized')

            return program.rpc.removeQuestion(questionKey, {
                accounts: {
                    game: gamePda,
                    authority: walletPublicKey,
                },
            })
        },
        {
            onSuccess() {
                return Promise.all([
                    queryClient.invalidateQueries(cacheKeys.games), // TODO query games separately
                    queryClient.invalidateQueries([cacheKeys.questions, gameIndex]),
                ])
            },
        },
    )
}

export function useStartGame(gameIndex: number) {
    const [gamePda] = useGamePdaFor(gameIndex)
    const [program] = useProgram()
    const walletPublicKey = useWalletPublicKey()

    return useMutation(
        async () => {
            if (!gamePda) return
            if (!program) return
            if (!walletPublicKey) throw new ProgramError('Unauthorized')

            return new Promise<trivia.EditGameEvent>((resolve) => {
                const listener = program.addEventListener('EditGameEvent', async (event: trivia.EditGameEvent) => {
                    await program.removeEventListener(listener)
                    resolve(event)
                })

                program.rpc.startGame({
                    accounts: {
                        game: gamePda,
                        authority: walletPublicKey,
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

interface RevealQuestionOptions extends StoredQuestionData {
    questionKey: anchor.web3.PublicKey
}

export function useRevealQuestion(gameIndex: number) {
    const [gamePda] = useGamePdaFor(gameIndex)
    const [program] = useProgram()
    const walletPublicKey = useWalletPublicKey()

    return useMutation(
        async ({ questionKey, name, variants }: RevealQuestionOptions) => {
            if (!gamePda) return
            if (!program) return
            if (!walletPublicKey) throw new ProgramError('Unauthorized')

            return new Promise<trivia.RevealQuestionEvent>((resolve) => {
                const listener = program.addEventListener(
                    'RevealQuestionEvent',
                    async (event: trivia.RevealQuestionEvent) => {
                        await program.removeEventListener(listener)
                        resolve(event)
                    },
                )

                program.rpc.revealQuestion(name, variants, {
                    accounts: {
                        question: questionKey,
                        game: gamePda,
                        authority: walletPublicKey,
                    },
                })
            })
        },
        {
            onSuccess() {
                return Promise.all([
                    queryClient.invalidateQueries(cacheKeys.games), // TODO query games separately
                    queryClient.invalidateQueries([cacheKeys.questions, gameIndex]),
                ])
            },
        },
    )
}

interface RevealAnswerOptions {
    questionKey: anchor.web3.PublicKey
    variantId: number
}

export function useRevealAnswer(gameIndex: number) {
    const [gamePda] = useGamePdaFor(gameIndex)
    const [program] = useProgram()
    const walletPublicKey = useWalletPublicKey()

    return useMutation(
        async ({ questionKey, variantId }: RevealAnswerOptions) => {
            if (!gamePda) return
            if (!program) return
            if (!walletPublicKey) throw new ProgramError('Unauthorized')

            return new Promise<trivia.RevealAnswerEvent>((resolve) => {
                const listener = program.addEventListener(
                    'RevealAnswerEvent',
                    async (event: trivia.RevealAnswerEvent) => {
                        await program.removeEventListener(listener)
                        resolve(event)
                    },
                )

                program.rpc.revealAnswer(variantId, {
                    accounts: {
                        question: questionKey,
                        game: gamePda,
                        authority: walletPublicKey,
                    },
                })
            })
        },
        {
            onSuccess() {
                return Promise.all([
                    queryClient.invalidateQueries(cacheKeys.games), // TODO query games separately
                    queryClient.invalidateQueries([cacheKeys.questions, gameIndex]),
                    queryClient.invalidateQueries([cacheKeys.answers, gameIndex]),
                ])
            },
        },
    )
}
