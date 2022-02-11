import { theme } from '../../../design-system'

export const colors = {
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
