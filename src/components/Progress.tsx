import { Box, Color, styled, theme } from '../design-system'

interface ProgressProps {
    value: number
    color: Color
    background: Color
    width: number
    size: number
}

const Container = styled(Box, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
})

const Circle = styled('circle', {
    transition: 'stroke-dashoffset .35s linear, stroke .8s linear',
})

export function Progress({ value, color, background, width, size }: ProgressProps) {
    value = Math.max(0, Math.min(value, 1))

    const center = size / 2

    const radius = center - width / 2
    const c = Math.PI * (radius * 2)
    const strokeDashoffset = -((1 - value) * c)

    return (
        <Container css={{ size }}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} version="1.1">
                <Circle
                    r={radius}
                    cx={center}
                    cy={center}
                    fill="transparent"
                    strokeDasharray="565.48"
                    strokeWidth={width}
                    stroke={theme.colors[background].value}
                />
                <Circle
                    r={radius}
                    cx={center}
                    cy={center}
                    fill="transparent"
                    strokeDasharray="565.48"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(270 ${center} ${center})`}
                    strokeWidth={width}
                    stroke={theme.colors[color].value}
                />
            </svg>
        </Container>
    )
}
