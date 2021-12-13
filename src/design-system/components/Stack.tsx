import { ReactNode } from 'react'
import flattenChildren from 'react-keyed-flatten-children'

import { alignToDisplay, alignToFlexAlign, mapPropToStyle, mapVariantsToStyle, resolveKey } from '../utils'
import { Box } from './Box'
import { Align, MediaProp, Space, alignTokens, spaceTokens, styled } from '..'

export interface StackProps {
    children: ReactNode
    as?: 'div' | 'ol' | 'ul'
    space?: MediaProp<Space>
    align?: MediaProp<Align>
    dividers?: boolean | ReactNode
}

const StackItem = styled(Box, {
    variants: {
        space: mapVariantsToStyle(spaceTokens, (space) =>
            space === 'none' ? {} : { '&:not(:last-child)': { paddingBottom: `$${space}` } },
        ),
        align: mapVariantsToStyle(alignTokens, (align) =>
            align === 'left'
                ? {}
                : {
                      display: mapPropToStyle(align, alignToDisplay),
                      alignItems: mapPropToStyle(align, alignToFlexAlign),
                      flexDirection: 'column',
                  },
        ),
    },
})

const DividerContainer = styled(Box, {
    width: '100%',
    variants: {
        space: mapVariantsToStyle(spaceTokens, (space) => (space === 'none' ? {} : { paddingBottom: `$${space}` })),
    },
})

export function Stack({ children, as = 'div', align = 'left', space, dividers }: StackProps) {
    const stackItems = flattenChildren(children)

    const isList = as === 'ol' || as === 'ul'
    const stackItemComponent = isList ? 'li' : 'div'

    if (stackItems.length <= 1 && align === 'left' && !isList) {
        return stackItems
    }

    return (
        <Box as={as}>
            {stackItems.map((child, index) => {
                return (
                    <StackItem key={resolveKey(child, index)} as={stackItemComponent} space={space} align={align}>
                        {dividers && index > 0 ? <DividerContainer space={space}>{dividers}</DividerContainer> : null}
                        {child}
                    </StackItem>
                )
            })}
        </Box>
    )
}
