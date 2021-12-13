import type { ReactElement } from 'react'

import { globalCss } from './config'

const globalStyles = globalCss({
    '@font-face': [
        {
            fontFamily: 'Graphik LC Web',
            fontStyle: 'normal',
            fontWeight: 400,
            fontDisplay: 'swap',
            src: 'url("/fonts/Graphik-LC-Web.ttf") format("truetype")',
        },
        {
            fontFamily: 'Blacker Sans Text',
            fontStyle: 'normal',
            fontWeight: 800,
            fontDisplay: 'swap',
            src: 'url("/fonts/BlackerSansText-Extrabold.woff2") format("woff2"), url("/fonts/BlackerSansText-Extrabold.woff") format("woff")',
        },
        {
            fontFamily: 'Blacker Sans Pro',
            fontStyle: 'italic',
            fontWeight: 400,
            fontDisplay: 'swap',
            src: 'url("/fonts/BlackerSansPro-Italic.woff2") format("woff2"), url("/fonts/BlackerSansPro-Italic.woff") format("woff")',
        },
    ],

    html: {
        colorScheme: 'dark',
    },

    body: {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        '-webkit-font-smoothing': 'antialiased',
        '-moz-osx-font-smoothing': 'grayscale',

        backgroundColor: '$black',
        fontFamily: '$body',
    },
})

export const StyleProvider = ({ children }: { children: ReactElement }) => {
    globalStyles()

    return children
}