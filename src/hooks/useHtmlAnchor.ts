import { MouseEvent } from 'react'
import { useMatch } from 'react-router-dom'

export function useHtmlAnchor(id: string, path = '') {
    const match = useMatch(path)
    path = match ? '' : path

    const hash = `#${id}`

    const scroll = () => {
        const target = document.getElementById(id)

        if (!target) return

        if (path) {
            window.history.replaceState(null, '', hash)
        } else {
            window.history.pushState(null, '', hash)
        }

        target.scrollIntoView({ behavior: 'smooth' })
    }

    return {
        to: `${path}${hash}`,
        target: '_self',
        onClick: (e: MouseEvent<HTMLAnchorElement>) => {
            if (path) {
                setTimeout(scroll, 0)
                return
            }

            e.preventDefault()
            scroll()
        },
    }
}
