import * as stitches from '@stitches/react'

import { medias } from './medias'

export const cssFactory = stitches.createStitches({
    media: medias,
    theme: {
        space: {
            none: '0',
            xs: '4px',
            sm: '8px',
            md: '12px',
            lg: '16px',
            xl: '20px',
            xxl: '24px',
        },
        colors: {
            black: '#171717',
            white: '#FFFFFF',
            whiteA: '#FFFFFF80',
            darkGrey: '#232323',
            greyA: '#00000080',
            blue: '#1A51CC',
            lightBlue: '#C7D7F0',
            purple: '#762D82',
            orange: '#ED432B',
            yellow: '#FDC351',
            pink: '#F2CBDE',
            beige: '#DFDCD2',
            green: '#28462A',
            brightGreen: '#CCFD51',
        },
        fontSizes: {
            sm: '16px',
            md: '18px',
            lg: '24px',
            xl: '36px',
            xxl: '56px',
        },
        fonts: {
            heading: 'Blacker Sans Text, serif',
            text: 'Blacker Sans Pro, serif',
            body: 'Graphik LC Web, sans-serif',
        },
        lineHeights: {
            base: '1',
            xs: '1.18',
        },
        letterSpacings: {},
        fontWeights: {
            medium: '400',
            bold: '800',
        },
        sizes: {},
        borderWidths: {
            xs: '1.5px',
        },
        borderStyles: {},
        shadows: {},
        transitions: {},
        radii: {
            md: '72px',
            round: '50%',
            pill: '9999px',
        },
        zIndices: {
            1: '100',
            2: '200',
            3: '300',
            4: '400',
            max: '999',
        },
    },
    utils: {
        marginX: (value: stitches.PropertyValue<'margin'>) => ({ marginLeft: value, marginRight: value }),
        marginY: (value: stitches.PropertyValue<'margin'>) => ({ marginTop: value, marginBottom: value }),
        paddingX: (value: stitches.PropertyValue<'padding'>) => ({ paddingLeft: value, paddingRight: value }),
        paddingY: (value: stitches.PropertyValue<'padding'>) => ({ paddingTop: value, paddingBottom: value }),
        inset: (value: stitches.PropertyValue<'inset'>) => ({ left: value, right: value, top: value, bottom: value }),
        size: (value: stitches.PropertyValue<'width' | 'height'>) => ({ width: value, height: value }),
        minSize: (value: stitches.PropertyValue<'minWidth' | 'minHeight'>) => ({ minWidth: value, minHeight: value }),
    },
})

export const { styled, css, theme, config, keyframes, globalCss, getCssText } = cssFactory

console.log({ css: getCssText() })
