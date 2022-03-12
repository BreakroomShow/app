import { AnimatePresence as AnimatePresenceOG, Variants } from 'framer-motion'
import { motion } from 'framer-motion-3d'
import { ReactNode } from 'react'

const variantsOG = {
    enter: { x: -20 },
    visible: { x: 0 },
    exit: { x: 20 },
}

interface AnimatePresenceProps {
    id: string
    isVisible: boolean
    children: ReactNode
    onExit(): void
    variants?: Variants
}

export const AnimatePresence = ({ onExit, isVisible, children, id, variants = variantsOG }: AnimatePresenceProps) => {
    return (
        <AnimatePresenceOG>
            <motion.group
                key={id}
                variants={variants}
                // @ts-ignore
                initial="enter"
                animate={isVisible ? 'visible' : 'exit'}
                exit="exit"
                transition={{ type: 'spring', duration: children ? 1 : 0, bounce: 0.1 }}
                onAnimationComplete={(definition) => {
                    if (definition === 'exit') onExit()
                }}
            >
                {children}
            </motion.group>
        </AnimatePresenceOG>
    )
}
