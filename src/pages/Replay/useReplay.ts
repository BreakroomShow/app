import { createContext, useContext } from 'react'

type ContextProps = {
    isPlaying: boolean
    speed: number
}

export const ReplayContext = createContext<ContextProps>({
    isPlaying: true,
    speed: 1,
})

export function useReplay() {
    return useContext(ReplayContext)
}
