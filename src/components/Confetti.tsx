import confetti from 'canvas-confetti'
import { useEffect } from 'react'

import { useReplay } from '../pages/Replay'

export function Confetti() {
    const { isPlaying, speed } = useReplay()

    /* prettier-ignore */
    useEffect(() => {
        if (!isPlaying) return

        function fire(x: number, y: number, opts: confetti.Options) {
            confetti({
                shapes: ['circle'],
                origin: { y, x },
                particleCount: 50,
                ...opts,
            })
        }

        fire(0,   0.8, { angle: 50,  spread: 60, startVelocity: 50, ticks: 120 / speed, scalar: 1.4, gravity: 0.3 * speed, drift:  1 })
        fire(1,   0.8, { angle: 130, spread: 60, startVelocity: 50, ticks: 120 / speed, scalar: 1.4, gravity: 0.3 * speed, drift: -1 })
        fire(0.3, 1,   { angle: 60,  spread: 70, startVelocity: 65, ticks: 150 / speed, scalar: 1.6, gravity: 0.7 * speed, drift: -2 })
        fire(0.7, 1,   { angle: 120, spread: 70, startVelocity: 65, ticks: 150 / speed, scalar: 1.6, gravity: 0.7 * speed, drift:  2 })

        return () => {
            confetti.reset()
        }
    }, [isPlaying, speed])

    return null
}
