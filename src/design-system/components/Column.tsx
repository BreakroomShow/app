import { ReactNode, useContext, useMemo } from 'react'

import { alignToFlexAlign, mapPropToStyle, mapVariantsToStyle } from '../utils'
import { Box } from './Box'
import { SpaceContext } from './Columns'
import { alignTokens, spaceTokens, styled } from '..'

type Fraction = number & {} // 1/2, 1/3, 2/3...

export interface ColumnProps {
    children: ReactNode
    width?: Fraction | 'content' | `${number}%`
    minWidth?: `${number}px`
}

const notFirstChildSelector = '&:not(:first-child) > *'

const ColumnContainer = styled(Box, {
    minWidth: 0,
    width: '100%',
    variants: {
        space: mapVariantsToStyle(spaceTokens, (space) =>
            space === 'none'
                ? {}
                : {
                      $$space: `$space$${space}`,
                      [notFirstChildSelector]: { paddingLeft: '$$space' },
                  },
        ),
    },
})

const ColumnContent = styled(Box, {
    height: '100%',
    variants: {
        align: mapVariantsToStyle(alignTokens, (align) => ({
            display: 'flex',
            justifyContent: mapPropToStyle(align, alignToFlexAlign),
        })),
    },
})

export function Column({ children, width, minWidth }: ColumnProps) {
    const context = useContext(SpaceContext)

    if (context == null) {
        throw new Error('Column must be used within Columns')
    }

    const { space = 'none', align, collapseBelow, collapseAbove } = context

    const css = useMemo(() => {
        return {
            minWidth,
            ...(typeof width === 'string' && width.endsWith('%') && { flex: `0 0 ${width}` }),
            ...(typeof width === 'number' && { flex: `0 0 ${width * 100}%` }),
            ...(width === 'content' && { width: 'auto', flexShrink: 0 }),
            ...(collapseBelow && {
                [collapseBelow]: { [notFirstChildSelector]: { paddingTop: '$$space', paddingLeft: 0 } },
            }),
            ...(collapseAbove && {
                [collapseAbove]: { [notFirstChildSelector]: { paddingTop: '$$space', paddingLeft: 0 } },
            }),
        }
    }, [collapseAbove, collapseBelow, minWidth, width])

    return (
        <ColumnContainer css={css} space={space}>
            <ColumnContent align={align}>{children}</ColumnContent>
        </ColumnContainer>
    )
}
