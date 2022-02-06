import { CountUp as CountUpJs } from 'countup.js'
import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
    children: number
    duration?: number
}

export function CountUp({ children, duration }: CountUpProps) {
    const [ref, setRef] = useState<HTMLSpanElement | null>(null)
    const countUpRef = useRef<CountUpJs | null>(null)

    useEffect(() => {
        if (!ref) return

        if (countUpRef.current) {
            countUpRef.current.update(children)
            return
        }

        countUpRef.current = new CountUpJs(ref, children, { duration })
        countUpRef.current.start()
    }, [children, duration, ref])

    return <span ref={setRef} />
}
