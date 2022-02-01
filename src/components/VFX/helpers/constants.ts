import { theme } from '../../../design-system'

export const colors = {
    malevolentIllusion: ['#c06995', '#de77c7', '#df86df', '#d998ee', '#ceadf4', '#c6bff9'],
    sunnyRainbow: ['#fbe555', '#fb9224', '#f45905', '#be8abf', '#ffeed0', '#feff89'],
    trivia: [
        theme.colors.brightGreen,
        theme.colors.yellow,
        theme.colors.orange,
        theme.colors.beige,
        theme.colors.lightBlue,
        theme.colors.green,
        theme.colors.pink,
    ].map((c) => c.value),
}

export const textConfig = { size: 1, height: 0.75 }
