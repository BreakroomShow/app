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
