import { ComponentProps, ReactNode, createContext, useContext, useMemo } from 'react'

import { mapVariantsToStyle, resolveToken } from '../utils'
import { Box } from './Box'
import { Truncate } from './Truncate'
import {
    Align,
    Color,
    Font,
    FontSize,
    FontWeight,
    LineHeight,
    MediaProp,
    alignTokens,
    fontSizeTokens,
    lineHeightTokens,
    styled,
    weightTokens,
} from '..'

export interface TextProps extends TextStyleProps, Pick<ComponentProps<typeof TextComponent>, 'css'> {
    children: ReactNode
    as?: keyof JSX.IntrinsicElements
    className?: string
}

interface TextStyleProps {
    color?: Color | 'inherit'
    font?: Font | 'inherit'
    size?: MediaProp<FontSize | 'inherit'>
    lineHeight?: MediaProp<LineHeight | 'inherit'>
    weight?: MediaProp<FontWeight | 'inherit'>
    fontStyle?: MediaProp<'normal' | 'italic'>
    align?: MediaProp<Align>
    preserveLinebreaks?: MediaProp<boolean>
    truncate?: boolean | ComponentProps<typeof Truncate>['lines']
}

interface TextContextValue extends TextStyleProps {
    inText: boolean
}

const TextContext = createContext<TextContextValue>({
    lineHeight: 'xs',
    color: 'inherit',
    size: 'md',
    weight: 'medium',
    font: 'body',
    inText: false,
})

const TextComponent = styled(Box, {
    variants: {
        size: mapVariantsToStyle(['inherit', ...fontSizeTokens] as const, (fontSize) => ({
            fontSize: resolveToken(fontSize),
        })),
        lineHeight: mapVariantsToStyle(['inherit', ...lineHeightTokens] as const, (lineHeight) => ({
            lineHeight: resolveToken(lineHeight),
        })),
        weight: mapVariantsToStyle(['inherit', ...weightTokens] as const, (fontWeight) => ({
            fontWeight: resolveToken(fontWeight),
        })),
        fontStyle: {
            normal: { fontStyle: 'normal' },
            italic: { fontStyle: 'italic' },
        },
        align: mapVariantsToStyle(alignTokens, (align) => ({
            textAlign: align,
        })),
        preserveLinebreaks: {
            true: {
                whiteSpace: 'pre-line',
            },
        },
    },
})

export function Text({
    as = 'span',
    children,
    className,
    align,
    preserveLinebreaks,
    truncate,
    css,
    ...props
}: TextProps) {
    const ctx = useContext(TextContext)

    if (truncate && ctx.inText) {
        throw new Error('truncation is not supported in inner <Text />')
    }

    const {
        color = ctx.color,
        font = ctx.font,
        size = ctx.size,
        lineHeight = ctx.lineHeight,
        weight = ctx.weight,
        fontStyle = ctx.fontStyle,
    } = props

    const textContext = useMemo(
        () => ({ color, size, lineHeight, weight, fontStyle, inText: true }),
        [color, lineHeight, size, weight, fontStyle],
    )

    return (
        <TextContext.Provider value={textContext}>
            <TextComponent
                as={as}
                className={className}
                size={size}
                lineHeight={lineHeight}
                align={align}
                weight={weight}
                fontStyle={fontStyle}
                preserveLinebreaks={preserveLinebreaks}
                css={{
                    display: ctx.inText ? 'inline' : 'block',
                    color: resolveToken(color),
                    fontFamily: resolveToken(font),
                    ...css,
                }}
            >
                {truncate ? <Truncate lines={truncate === true ? 1 : truncate}>{children}</Truncate> : children}
            </TextComponent>
        </TextContext.Provider>
    )
}
