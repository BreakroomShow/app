import { styled } from '../../../design-system'

export const PageTitle = styled('span', {
    display: 'block',

    fontFamily: '$heading',
    fontWeight: '$bold',
    color: '$black',

    fontSize: '88px',
    lineHeight: '90px',
    '@down-xl': {
        fontSize: '66px',
        lineHeight: '68px',
    },
    '@down-lg': {
        fontSize: '50px',
        lineHeight: '52px',
    },

    textAlign: 'center',
    whiteSpace: 'pre-wrap',
    letterSpacing: '-0.01em',
})
