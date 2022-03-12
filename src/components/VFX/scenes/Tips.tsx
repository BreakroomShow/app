import { useState } from 'react'

import { GameEvent } from '../../../types'
import { AnimatePresence } from '../components/AnimatePresence'
import { Diamonds } from '../components/Diamonds'
import { FlatText } from '../components/FlatText'

const variants = {
    enter: { scale: 0.001 },
    visible: { scale: 1 },
    exit: { scale: 0.001 },
}

export const Tips = ({ event: nextEvent }: { event: GameEvent }) => {
    if (nextEvent.type !== 'crypto_fact') throw new Error('Tips work with "crypto_fact" event only')

    const [event, setEvent] = useState(nextEvent)

    return (
        <>
            <AnimatePresence
                id={event.text}
                onExit={() => setEvent(nextEvent)}
                isVisible={nextEvent.text === event.text}
                variants={variants}
            >
                <FlatText text={event.text} widthCoeff={0.33} />
            </AnimatePresence>
            <Diamonds />
        </>
    )
}
