import { Box } from '@react-three/drei'
import { useState } from 'react'

import { CryptoFactEvent } from '../../../types'
import { AnimatePresence } from '../components/AnimatePresence'
import { Diamonds } from '../components/Diamonds'
import { FlatText } from '../components/FlatText'

export const Tips = ({ event: nextEvent }: { event: CryptoFactEvent }) => {
    const [event, setEvent] = useState(nextEvent)
    return (
        <>
            <AnimatePresence
                id={event.text}
                onExit={() => setEvent(nextEvent)}
                isVisible={nextEvent.text === event.text}
            >
                <FlatText text={event.text} widthCoeff={0.33} />
            </AnimatePresence>
            <Diamonds />
        </>
    )
}
