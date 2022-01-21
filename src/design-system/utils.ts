import { ReactNode } from 'react'

import { Custom } from './types'

export const alignToDisplay = {
    left: 'block',
    center: 'flex',
    right: 'flex',
} as const

export const alignToFlexAlign = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
} as const

export const alignYToFlexAlign = {
    top: 'flex-start',
    center: 'center',
    bottom: 'flex-end',
} as const

export function mapPropToStyle<Keys extends string | number, MappedValues extends string>(
    value: Keys | undefined,
    valueMap: Record<Keys, MappedValues>,
): MappedValues | undefined {
    if (value === undefined) {
        return value
    }

    if (typeof value === 'string' || typeof value === 'number') {
        return valueMap[value]
    }
}

export function mapVariantsToStyle<T extends string | number, Styles>(
    variants: readonly T[],
    mapper: (variant: T) => Styles,
): Record<T, Styles> {
    const styles = {} as Record<T, Styles>

    variants.forEach((variant) => {
        styles[variant] = mapper(variant)
    })

    return styles
}

export function resolveKey(node: ReactNode, index: number) {
    if (!node) {
        return index
    }

    if (typeof node === 'object' && 'key' in node) {
        return node.key || index
    }

    return String(node)
}

export function resolveToken<T extends string>(token?: T | 'inherit') {
    if (token == null || token === 'inherit') {
        return token
    }

    return `$${token}` as const
}

export function isCustom<T>(value: unknown): value is Custom<T> {
    return Boolean(value && typeof value === 'object' && 'custom' in value)
}
