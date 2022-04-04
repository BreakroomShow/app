import { theme } from '../../../design-system'

export const scaleVariants = {
    enter: { scale: 0.001 },
    visible: { scale: 1 },
    exit: { scale: 0.001 },
}

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
    sparks: [
        theme.colors.yellow,
        theme.colors.purple,
        theme.colors.orange,
        theme.colors.blue,
        theme.colors.lightBlue,
        theme.colors.pink,
    ].map((c) => c.value),
    text: [theme.colors.blue, theme.colors.purple, theme.colors.orange, theme.colors.yellow, theme.colors.green].map(
        (c) => c.value,
    ),
}

export const textConfig = { size: 1, height: 0.75 }
