import { ReactElement, useEffect } from 'react'

import { globalCss } from './config'

const globalStyles = globalCss({
    '@font-face': [
        {
            fontFamily: 'Graphik LC Web',
            fontStyle: 'normal',
            fontWeight: 400,
            src: 'url("/fonts/Graphik-LC-Web-Regular.ttf") format("truetype")',
        },
        {
            fontFamily: 'Graphik LC Web',
            fontStyle: 'normal',
            fontWeight: 500,
            src: 'url("/fonts/Graphik-LC-Web.ttf") format("truetype")',
        },
        {
            fontFamily: 'Blacker Sans Text',
            fontStyle: 'normal',
            fontWeight: 800,
            src: 'url("/fonts/BlackerSansText-Heavy.ttf") format("truetype"), url("/fonts/BlackerSansText-Extrabold.woff") format("woff")',
        },
        {
            fontFamily: 'Blacker Sans Pro',
            fontStyle: 'italic',
            fontWeight: 400,
            src: 'url("/fonts/BlackerSansPro-Italic.ttf") format("truetype"), url("/fonts/BlackerSansPro-Italic.woff") format("woff")',
        },
    ],

    html: {
        colorScheme: 'dark',
    },

    body: {
        margin: 0,
        padding: 0,
        '-webkit-font-smoothing': 'antialiased',
        '-moz-osx-font-smoothing': 'grayscale',

        backgroundColor: 'black',
        fontFamily: '$body',
    },

    a: {
        color: 'inherit',
    },

    '*': {
        boxSizing: 'border-box !important',
    },
})

export const StyleProvider = ({ children }: { children: ReactElement }) => {
    globalStyles()

    useEffect(() => {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault()

                const href = anchor.getAttribute('href')!
                const target = document.querySelector(href)

                if (target) {
                    window.history.pushState(null, '', href)
                    target.scrollIntoView({ behavior: 'smooth' })
                }
            })
        })
    }, [])

    return children
}
