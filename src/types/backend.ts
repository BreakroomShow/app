export type GameFlowEvent = Exclude<GameEvent, ViewerCountUpdateEvent>

export type GameEvent =
    | IntroSplashEvent
    | GameInfoSplashEvent
    | QuestionEvent
    | AnswerRevealEvent
    | QuestionFactEvent
    | CryptoFactEvent
    | ViewerCountUpdateEvent

export type DistributionType = 'socket' | 'chain'

export interface BaseEvent {
    distribution_type: DistributionType
    duration: number
    game_start_offset: number
}

export interface IntroSplashEvent extends BaseEvent {
    type: 'intro_splash'
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
    answer_count: Record<'0' | '1' | '2', number>
}

export interface QuestionFactEvent extends BaseEvent {
    type: 'question_fact'
    text: string
    image_url: null | string
}

export interface CryptoFactEvent extends BaseEvent {
    type: 'crypto_fact'
    text: string
    image_url: null | string
}

export interface ViewerCountUpdateEvent extends BaseEvent {
    type: 'viewer_count_update'
    viewer_count: number
}

export interface Replay {
    game_id: string
    game_started_at_timestamp: number
    game_finished_at_timestamp: number
    events: ReplayEvent<GameEvent>[]
    chat_messages: ReplayChatMessage[]
}

export interface ReplayEvent<E extends GameEvent> {
    timestamp: number
    event: E
}

export interface ReplayChatMessage {
    timestamp: number
    message: ChatMessage
}

export interface ChatMessage {
    id: string
    from_id: string
    text: string
}
