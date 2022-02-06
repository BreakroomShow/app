import { ReactElement } from 'react'

import { globalCss } from './config'

const globalStyles = globalCss({
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

    return children
}
