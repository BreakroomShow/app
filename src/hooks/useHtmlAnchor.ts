import { MouseEvent } from 'react'

export function useHtmlAnchor(id: string) {
    const url = `#${id}`

    return {
        to: url,
        target: '_self',
        onClick: (e: MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault()
            const target = document.getElementById(id)
            if (target) {
                window.history.pushState(null, '', url)
                target.scrollIntoView({ behavior: 'smooth' })
            }
        },
    }
}
