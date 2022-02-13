import { createContext, useContext } from 'react'

import { GameEvent } from '../../types'

type ContextProps = {
    isPlaying: boolean
    speed: number
    event?: null | GameEvent
}

export const ReplayContext = createContext<ContextProps>({
    isPlaying: true,
    speed: 1,
    event: null,
})

export function useReplay() {
    return useContext(ReplayContext)
}
