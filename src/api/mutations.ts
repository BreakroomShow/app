import * as anchor from '@project-serum/anchor'
import * as trivia from 'clic-trivia'
import { useRef } from 'react'
import { useMutation } from 'react-query'
import axios from 'redaxios'

import { config } from '../config'
import { useWallet } from '../containers/ConnectProvider'
import { GameOptions, StoredQuestionData } from '../types'
import { msToBn, secToBn } from '../utils/date'
import { ProgramError } from '../utils/error'
import { sha256 } from '../utils/sha256'
import { updateEmailNotification } from './methods'
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

            return program.rpc.editGame(options, {
                accounts: {
                    game: gamePda,
                    authority: walletPublicKey,
                },
            })
        },
        {
            onSuccess: () => {
                return queryClient.invalidateQueries(cacheKeys.games)
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

            return program.rpc.startGame({
                accounts: {
                    game: gamePda,
                    authority: walletPublicKey,
                },
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

            return program.rpc.revealQuestion(name, variants, {
                accounts: {
                    question: questionKey,
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

            return program.rpc.revealAnswer(variantId, {
                accounts: {
                    question: questionKey,
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

export function useSubmitAnswer(gameIndex: number) {
    const [triviaPda] = useTriviaPda()
    const [gamePda] = useGamePdaFor(gameIndex)
    const [program] = useProgram()
    const walletPublicKey = useWalletPublicKey()

    return useMutation(
        async ({ variantId, questionKey }: RevealAnswerOptions) => {
            if (!triviaPda) return
            if (!gamePda) return
            if (!program) return
            if (!walletPublicKey) throw new ProgramError('Unauthorized')

            const [userPda] = await trivia.UserPDA(config.programID, triviaPda, walletPublicKey)
            const [playerPda, playerBump] = await trivia.PlayerPDA(config.programID, gamePda, userPda)

            return program.rpc.submitAnswer(variantId, playerBump, {
                accounts: {
                    trivia: triviaPda,
                    game: gamePda,
                    user: userPda,
                    player: playerPda,
                    question: questionKey,
                    authority: walletPublicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                },
            })
        },
        {
            onSuccess() {
                return Promise.all([
                    queryClient.invalidateQueries(cacheKeys.games), // TODO query games separately
                    queryClient.invalidateQueries([cacheKeys.questions, gameIndex]),
                    queryClient.invalidateQueries([cacheKeys.user]),
                ])
            },
        },
    )
}

export function useWhitelistUser() {
    const [triviaPda] = useTriviaPda()
    const [program] = useProgram()
    const walletPublicKey = useWalletPublicKey()

    return useMutation(
        async (wallet: string) => {
            if (!triviaPda) return
            if (!program) return
            if (!walletPublicKey) throw new ProgramError('Unauthorized')

            const userPublicKey = new anchor.web3.PublicKey(wallet)
            const [userPda, userBump] = await trivia.UserPDA(config.programID, triviaPda, userPublicKey)

            return program.rpc.whitelistUser(userPublicKey, userBump, {
                accounts: {
                    trivia: triviaPda,
                    whitelistedUser: userPda,
                    authority: walletPublicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                },
            })
        },
        {
            onSuccess() {
                return queryClient.invalidateQueries(cacheKeys.user)
            },
        },
    )
}

export function useUpdateNextGame() {
    return useMutation(
        (gameId: number | null) => {
            return axios.post('/api/next-game', { gameId })
        },
        {
            onSuccess() {
                return queryClient.invalidateQueries(cacheKeys.nextGame)
            },
        },
    )
}

export function useUpdateEmailNotification() {
    const wallet = useWallet()

    return useMutation(async (email: string) => {
        if (!wallet.token) return
        return updateEmailNotification(email, wallet.token)
    })
}
