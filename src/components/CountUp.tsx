import { CountUp as CountUpJs } from 'countup.js'
import { useEffect, useRef } from 'react'

interface CountUpProps {
    children: number
}

export function CountUp({ children }: CountUpProps) {
    const ref = useRef<HTMLSpanElement | null>(null)
    const countUpRef = useRef<CountUpJs | null>(null)

    useEffect(() => {
        if (!ref.current) return

        if (countUpRef.current) {
            countUpRef.current.update(children)
            return
        }

        countUpRef.current = new CountUpJs(ref.current, children)
        countUpRef.current.start()
    }, [children])

    return <span ref={ref} />
}
