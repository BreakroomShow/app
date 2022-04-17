import { ReactNode, useEffect, useState } from 'react'
import useResizeObserver from 'use-resize-observer/polyfilled'

import { useSubmitAnswer } from '../api/mutations'
import { useCurrentGameQuery, usePlayerQuery } from '../api/query'
import { useSocketEvent } from '../api/socket'
import { Confetti } from '../components/Confetti'
import { ResultIcon } from '../components/ResultIcon'
import { Segment, SegmentContainer } from '../components/Segment'
import { Timer } from '../components/Timer'
import { ChatView } from '../containers/Chat'
import { useWallet } from '../containers/ConnectProvider'
import { VFX } from '../containers/VFX'
import { View } from '../containers/View'
import { Page } from '../design-system'
import { useGetLatest } from '../hooks/useGetLatest'
import { useTime } from '../hooks/useTime'
import { ChatMessage, GameFlowEvent } from '../types'
import { exhaustiveCheck } from '../utils/exhaustiveCheck'
import { RevealedQuestionView } from '../views/RevealedQuestionView'

// TODO real stats
const answered = 1089
const fund = 1000
const lives = 1

function QuestionControlsProvider({
    children,
    duration,
    gameId,
    questionId,
    questionKey,
}: {
    gameId: number
    questionId: number
    questionKey: null | string
    duration: number
    children: (data: {
        deadline: number
        deadlineExceed: boolean
        userAnswer: null | number
        onAnswer: null | ((variantId: number) => void)
    }) => ReactNode
}) {
    const wallet = useWallet()
    const [deadline] = useState(() => Date.now() + duration * 1000)
    const time = useTime()
    const deadlineExceed = time.moreThan(deadline)

    const { data: player = null } = usePlayerQuery(gameId)
    const playerAnswers = player?.answers || []
    const hasSkippedQuestion = questionId > playerAnswers.length
    const userAnswer = playerAnswers[questionId] ?? null

    const { mutate: submitAnswer, isLoading } = useSubmitAnswer(gameId)

    let canAnswer = questionId === 0 || !hasSkippedQuestion

    if (isLoading || questionKey == null || userAnswer != null || wallet.status !== 'connected') {
        canAnswer = false
    }

    const onAnswer = canAnswer ? (variantId: number) => submitAnswer({ questionKey: questionKey!, variantId }) : null

    return <>{children({ deadline, deadlineExceed, userAnswer, onAnswer })}</>
}

interface GameManagerProps {
    event: GameFlowEvent
    gameId: number
}

function useQuestionEventAnimation(nextEvent: GameManagerProps['event']) {
    const [event, setEvent] = useState(nextEvent)
    const [animation, setAnimation] = useState<'enter' | 'exit'>('enter')
    const getCurrentEventType = useGetLatest(() => event.type)

    useEffect(() => {
        const eventsToAnimate = ['question', 'answer_reveal']

        if (eventsToAnimate.includes(nextEvent.type) || !eventsToAnimate.includes(getCurrentEventType())) {
            setAnimation('enter')
            setEvent(nextEvent)
            return
        }

        setAnimation('exit')

        const id = setTimeout(() => {
            setEvent(nextEvent)
        }, 300)

        return () => {
            clearTimeout(id)
        }
    }, [getCurrentEventType, nextEvent])

    return [event, animation] as const
}

const placeholder = (
    <Segment w={4} h={3} color="transparent" inset="lg">
        {null}
    </Segment>
)

function GameManager({ event: nextEvent, gameId }: GameManagerProps) {
    const [event, animation] = useQuestionEventAnimation(nextEvent)

    if (event.type === 'game_info_splash') {
        return placeholder
    }

    if (event.type === 'question') {
        return (
            <Segment color="black" w={4} h={3} inset="lg" animation={animation}>
                <QuestionControlsProvider
                    duration={event.duration}
                    questionId={event.question_index}
                    questionKey={event.question_public_key}
                    gameId={gameId}
                >
                    {({ deadline, deadlineExceed, userAnswer, onAnswer }) => (
                        <RevealedQuestionView
                            questionId={event.question_index}
                            questionText={event.question}
                            answers={event.answers}
                            userAnswer={userAnswer}
                            correctAnswer={null}
                            answerCount={null}
                            answered={answered}
                            lives={lives}
                            fund={fund}
                            resultIcon={deadlineExceed ? null : <Timer deadline={deadline} />}
                            onAnswer={onAnswer}
                        />
                    )}
                </QuestionControlsProvider>
            </Segment>
        )
    }

    if (event.type === 'answer_reveal') {
        return (
            <Segment color="black" w={4} h={3} inset="lg" animation={animation}>
                <QuestionControlsProvider
                    duration={0}
                    questionId={event.question.question_index}
                    questionKey={null}
                    gameId={gameId}
                >
                    {({ userAnswer }) => {
                        const isCorrect = userAnswer === event.correct_answer_ind
                        const confetti = isCorrect ? <Confetti /> : null
                        const resultIcon =
                            userAnswer == null ? null : <ResultIcon variant={isCorrect ? 'correct' : 'wrong'} />

                        return (
                            <>
                                {confetti}
                                <RevealedQuestionView
                                    questionId={event.question.question_index}
                                    questionText={event.question.question}
                                    answers={event.question.answers}
                                    userAnswer={userAnswer}
                                    correctAnswer={event.correct_answer_ind}
                                    answerCount={event.answer_count}
                                    answered={answered}
                                    lives={lives}
                                    fund={fund}
                                    resultIcon={resultIcon}
                                />
                            </>
                        )
                    }}
                </QuestionControlsProvider>
            </Segment>
        )
    }

    if (event.type === 'question_fact' || event.type === 'crypto_fact' || event.type === 'intro_splash') {
        return placeholder
    }

    exhaustiveCheck(event)

    return null
}

export function Game() {
    const { data: currentGame = null } = useCurrentGameQuery()

    const [currentEvent, setCurrentEvent] = useState<GameFlowEvent | null>(null)
    useSocketEvent(
        currentGame?.socket_key,
        ['crypto_fact', 'game_info_splash', 'question_fact', 'question', 'answer_reveal', 'intro_splash'],
        setCurrentEvent,
    )

    const [messages, setMessages] = useState<ChatMessage[]>([])
    useSocketEvent(currentGame?.socket_key, ['new_message'], (m) => setMessages((prev) => [...prev, m]))

    const [viewers, setViewers] = useState(0)
    useSocketEvent(currentGame?.socket_key, ['viewer_count_update'], (e) => setViewers(e.viewer_count))

    const [sceneWidth, setSceneWidth] = useState(0)
    const [viewWidth, setViewWidth] = useState(0)
    const { ref: sceneRef } = useResizeObserver({ onResize: (size) => setSceneWidth(size.width || 0) })
    const { ref: viewRef } = useResizeObserver({ onResize: (size) => setViewWidth(size.width || 0) })

    return (
        <Page variant="dark">
            <main style={{ display: 'flex', padding: 40, minHeight: '100vh' }}>
                <VFX event={currentEvent} offset={viewWidth - sceneWidth} />
                <View ref={viewRef}>
                    <SegmentContainer ref={sceneRef}>
                        {currentEvent && currentGame ? (
                            <GameManager event={currentEvent} gameId={currentGame.game_index} />
                        ) : (
                            placeholder
                        )}
                    </SegmentContainer>
                    <ChatView viewers={viewers} messages={messages} />
                </View>
            </main>
        </Page>
    )
}
