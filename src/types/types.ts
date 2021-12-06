import * as anchor from '@project-serum/anchor'
import * as trivia from 'clic-trivia'

export interface UnrevealedQuestion {
    publicKey: string
    name: string
    variants: string[]
}

export interface StoredQuestionData {
    name: string
    variants: string[]
}

export interface GameOptions {
    name: string
    startTime: number
}

export interface Game extends trivia.Game {
    name: string
}

export interface RevealedQuestion {
    question: string
    variants: string[]
    deadline: anchor.BN
    answerVariantId?: number
}

export interface Question {
    game: anchor.web3.PublicKey
    authority: anchor.web3.PublicKey
    question: number[]
    variants: number[][]
    time: anchor.BN
    revealedQuestion?: RevealedQuestion
}
