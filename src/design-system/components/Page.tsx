import { ReactNode } from 'react'

import { css } from '../config'

const light = css({
    colorScheme: 'light',
    background: '$background',
    body: { background: '$background', color: '$black' },
})()

const dark = css({
    colorScheme: 'dark',
    background: 'unset',
    body: { background: 'unset', color: 'unset' },
})()

let currentStyles: string | null = null

function applyStyles(styles: string) {
    if (currentStyles === styles) return

    if (currentStyles) {
        document.documentElement.classList.remove(currentStyles)
    }

    document.documentElement.classList.add(styles)
    currentStyles = styles
}

export function Page({ children, variant = 'light' }: { children: ReactNode; variant?: 'light' | 'dark' }) {
    applyStyles(variant === 'light' ? light : dark)

    return <>{children}</>
}
