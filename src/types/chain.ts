import * as trivia from '@breakroom/programs'
import * as anchor from '@project-serum/anchor'

export interface UnrevealedQuestion {
    publicKey: string
    name: string
    variants: string[]
}

export interface StoredQuestionData extends Pick<UnrevealedQuestion, 'name' | 'variants'> {}

export interface GameOptions {
    name: string
    startTime: number
}

export interface Game extends trivia.Game {
    name: string
}

export interface RevealedQuestion {
    question: string
    variants: [string, string, string]
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
