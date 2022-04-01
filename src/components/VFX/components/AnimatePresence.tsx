import { Transition, Variants } from 'framer-motion'
import { motion } from 'framer-motion-3d'
import { ReactNode } from 'react'

const variantsOG = {
    enter: { x: -20 },
    visible: { x: 0 },
    exit: { x: 20 },
}

interface AnimatePresenceProps {
    id: string | number
    isVisible: boolean
    children: ReactNode
    onExit?(): void
    onVisible?(): void
    variants?: Variants
    transition?: Transition
}

export const AnimatePresence = ({
    onExit,
    isVisible,
    children,
    id,
    variants = variantsOG,
    onVisible,
    transition = { type: 'spring', duration: children ? 1 : 0, bounce: 0.1 },
}: AnimatePresenceProps) => {
    return (
        <motion.group
            key={id}
            variants={variants}
            // @ts-ignore
            initial="enter"
            animate={isVisible ? 'visible' : 'exit'}
            transition={transition}
            onAnimationComplete={(definition) => {
                if (definition === 'exit' && onExit) onExit()
                if (definition === 'visible' && onVisible) onVisible()
            }}
        >
            {children}
        </motion.group>
    )
}
