import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ReactNode, useRef } from 'react'

import { Box, keyframes, styled } from '../design-system'

const delay = 150

const Overlay = styled(DialogPrimitive.Overlay, {
    backgroundColor: '$greyA',
    position: 'fixed',
    zIndex: 1,
    inset: 0,
    animation: `${keyframes({
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
    })} ${delay}ms cubic-bezier(0.16, 1, 0.3, 1)`,
})

const Content = styled(DialogPrimitive.Content, {
    backgroundColor: '$beige',
    borderRadius: '$md',
    boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
    width: '90vw',
    maxWidth: '450px',
    maxHeight: '85vh',
    padding: 25,
    animation: `${keyframes({
        '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
        '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
    })} ${delay}ms cubic-bezier(0.16, 1, 0.3, 1)`,

    '&:focus': { outline: 'none' },
})

interface DialogProps {
    children: ReactNode
    close(): void
}

export function Dialog({ close, children }: DialogProps) {
    const lastFocus = useRef<HTMLElement | null>(document.activeElement as HTMLElement)

    function onClose() {
        setTimeout(() => {
            close()
            lastFocus.current?.focus()
        }, delay)
    }

    return (
        <DialogPrimitive.Root defaultOpen onOpenChange={(open) => (open ? null : onClose())}>
            <DialogPrimitive.Portal>
                <Overlay />
                <Content>
                    <Box css={{ position: 'absolute', top: 20, right: 20 }}>
                        <DialogPrimitive.Close asChild>
                            <button>X</button>
                        </DialogPrimitive.Close>
                    </Box>
                    {children}
                </Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
}
