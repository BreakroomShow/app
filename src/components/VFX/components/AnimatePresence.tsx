import { AnimatePresence as AnimatePresenceOG } from 'framer-motion'
import { motion } from 'framer-motion-3d'
import { useMemo } from 'react'

const variants = {
    hidden: { x: -10 },
    visible: { x: 0 },
    exit: { x: 10 },
}

interface AnimatePresenceProps {
    isVisible: boolean
    children: any
    handleExitFinished: any
    id: number
}

export const AnimatePresence = ({ handleExitFinished, isVisible, children, id }: AnimatePresenceProps) => {
    const animate = useMemo(() => (isVisible ? 'visible' : 'exit'), [isVisible, children])

    const handleAnimationComplete = () => animate === 'exit' && handleExitFinished()

    return (
        <AnimatePresenceOG>
            {children && (
                <motion.group
                    key={id}
                    variants={variants}
                    initial="hidden"
                    animate={animate}
                    transition={{ duration: 1 }}
                    onAnimationComplete={handleAnimationComplete}
                >
                    {children}
                </motion.group>
            )}
        </AnimatePresenceOG>
    )
}
