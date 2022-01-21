import { ReactNode, createContext, useContext, useMemo } from 'react'

import { Text, TextProps } from './Text'

interface TypographyProps extends Omit<TextProps, 'as' | 'font' | 'size' | 'weight' | 'fontStyle'> {
    as?: 'h1' | 'h2' | 'h3' | 'text1' | 'text2' | 'body1' | 'body2'
    component?: TextProps['as']
}

const typography: Record<
    Required<TypographyProps>['as'],
    Pick<TextProps, 'size' | 'font' | 'lineHeight' | 'weight' | 'fontStyle'>
> = {
    h1: {
        font: 'heading',
        size: 'xxl',
        weight: 'bold',
    },
    h2: {
        font: 'heading',
        size: 'xl',
        weight: 'bold',
    },
    h3: {
        font: 'heading',
        size: 'lg',
        weight: 'bold',
    },
    text1: {
        font: 'text',
        size: 'md',
        fontStyle: 'italic',
    },
    text2: {
        font: 'text',
        size: 'sm',
        fontStyle: 'italic',
    },
    body1: {
        font: 'body',
        size: 'sm',
        weight: 'bold',
    },
    body2: {
        font: 'body',
        size: 'sm',
    },
}

interface TypographyContextValue extends Pick<TypographyProps, 'as' | 'color'> {}

const TypeGroupContext = createContext<TypographyContextValue>({ as: 'text1' })

interface TypeGroupProps extends TypographyContextValue {
    children: ReactNode
}

export function TypeGroup({ children, as, color }: TypeGroupProps) {
    const ctx = useMemo(() => ({ as, color }), [as, color])
    return <TypeGroupContext.Provider value={ctx}>{children}</TypeGroupContext.Provider>
}

export function Typography({ as: asProp, component, ...props }: TypographyProps) {
    const { as: asCtx, color } = useContext(TypeGroupContext)
    const as = asProp || asCtx || 'text1'

    return <Text as={component} color={color} {...props} {...typography[as]} />
}
