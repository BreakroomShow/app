import { ReactNode } from 'react'
import flattenChildren from 'react-keyed-flatten-children'

import { alignToFlexAlign, alignYToFlexAlign, mapPropToStyle, mapVariantsToStyle, resolveKey } from '../utils'
import { Box } from './Box'
import { Align, AlignY, MediaProp, Space, alignTokens, alignYTokens, spaceTokens, styled } from '..'

export interface InlineProps {
    children: ReactNode
    align?: MediaProp<Align>
    alignY?: MediaProp<AlignY>
    space?: MediaProp<Space>
    spaceY?: MediaProp<Space>
    wrap?: MediaProp<'nowrap' | 'wrap'>
}

const InlineContainer = styled(Box, {
    '&:before': {
        content: '""',
        display: 'block',
    },
    variants: {
        spaceY: mapVariantsToStyle(spaceTokens, (space) => (space === 'none' ? {} : { marginTop: `-$${space}` })),
    },
})

const InlineContent = styled(Box, {
    display: 'flex',
    flexShrink: 0,
    variants: {
        space: mapVariantsToStyle(spaceTokens, (space) => (space === 'none' ? {} : { marginLeft: `-$${space}` })),
        align: mapVariantsToStyle(alignTokens, (align) => ({
            justifyContent: mapPropToStyle(align, alignToFlexAlign),
        })),
        alignY: mapVariantsToStyle(alignYTokens, (alignY) => ({
            alignItems: mapPropToStyle(alignY, alignYToFlexAlign),
        })),
        wrap: {
            wrap: { flexWrap: 'wrap' },
            nowrap: { flexWrap: 'nowrap' },
        },
    },
})

const InlineItem = styled(Box, {
    minWidth: 0,
    variants: {
        space: mapVariantsToStyle(spaceTokens, (space) => (space === 'none' ? {} : { marginLeft: `$${space}` })),
        spaceY: mapVariantsToStyle(spaceTokens, (space) => (space === 'none' ? {} : { paddingTop: `$${space}` })),
    },
})

export function Inline({ children, space, spaceY = space, align, alignY = 'center', wrap = 'wrap' }: InlineProps) {
    return (
        <InlineContainer spaceY={spaceY}>
            <InlineContent space={space} align={align} alignY={alignY} wrap={wrap}>
                {flattenChildren(children).map((child, index) =>
                    child == null ? null : (
                        <InlineItem key={resolveKey(child, index)} space={space} spaceY={spaceY}>
                            {child}
                        </InlineItem>
                    ),
                )}
            </InlineContent>
        </InlineContainer>
    )
}
