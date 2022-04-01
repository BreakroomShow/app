import { useState } from 'react'

import { GameEvent } from '../../../types'
import { AnimatePresence } from '../components/AnimatePresence'
import { Diamonds } from '../components/Diamonds'
import { FlatText } from '../components/FlatText'
import { scaleVariants } from '../helpers/constants'

export const Tips = ({ event: nextEvent }: { event: GameEvent }) => {
    if (nextEvent.type !== 'crypto_fact') throw new Error('Tips work with "crypto_fact" event only')

    const [event, setEvent] = useState(nextEvent)

    return (
        <>
            <AnimatePresence
                id={event.text}
                onExit={() => setEvent(nextEvent)}
                isVisible={nextEvent.text === event.text}
                variants={scaleVariants}
                transition={{ type: 'spring', bounce: 0.3 }}
            >
                <FlatText text={event.text} widthCoeff={0.33} />
            </AnimatePresence>
            <Diamonds />
        </>
    )
}
