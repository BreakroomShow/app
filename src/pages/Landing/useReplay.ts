import { createContext, useContext } from 'react'

export const ReplayContext = createContext({ isPlaying: true, speed: 1 })

export function useReplay() {
    return useContext(ReplayContext)
}
