export type GameEvent = GameInfoSplashEvent | QuestionEvent | AnswerRevealEvent | QuestionFactEvent | CryptoFactEvent

export type DistributionType = 'socket' | 'chain'

export interface BaseEvent {
    distribution_type: DistributionType
    duration: number
    game_start_offset: number
}

export interface GameInfoSplashEvent extends BaseEvent {
    type: 'game_info_splash'
    players: number
    prize_fund_usd: number
    sponsor_title: string
}

export interface QuestionEvent extends BaseEvent {
    type: 'question'
    question: string
    answers: [string, string, string]
}

export interface AnswerRevealEvent extends BaseEvent {
    type: 'answer_reveal'
    question: QuestionEvent
    correct_answer_ind: number
    answer_count: [number, number, number]
}

export interface QuestionFactEvent extends BaseEvent {
    type: 'question_fact'
    text: number
    image_url: null | string
}

export interface CryptoFactEvent extends BaseEvent {
    type: 'crypto_fact'
    text: number
    image_url: null | string
}

export type Replay = {
    game_id: string
    game_started_at_timestamp: number
    game_finished_at_timestamp: number
    events: ReplayEvent[]
}

export type ReplayEvent = {
    timestamp: number
    event: GameEvent
}
