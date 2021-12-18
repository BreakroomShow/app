import { ReactNode } from 'react'

import { styled } from '../config'
import { spaceTokens } from '../tokens'
import { MediaProp, Space } from '../types'
import { mapVariantsToStyle, resolveToken } from '../utils'
import { Box } from './Box'

interface InsetProps {
    space?: MediaProp<Space>
    y?: MediaProp<Space>
    x?: MediaProp<Space>
    top?: MediaProp<Space>
    bottom?: MediaProp<Space>
    left?: MediaProp<Space>
    right?: MediaProp<Space>

    children: ReactNode
}

const InsetComponent = styled(Box, {
    variants: {
        top: mapVariantsToStyle(spaceTokens, (space) => (space === 'none' ? {} : { paddingTop: resolveToken(space) })),
        left: mapVariantsToStyle(spaceTokens, (space) =>
            space === 'none' ? {} : { paddingLeft: resolveToken(space) },
        ),
        right: mapVariantsToStyle(spaceTokens, (space) =>
            space === 'none' ? {} : { paddingRight: resolveToken(space) },
        ),
        bottom: mapVariantsToStyle(spaceTokens, (space) =>
            space === 'none' ? {} : { paddingBottom: resolveToken(space) },
        ),
    },
})

export function Inset({ children, top, right, bottom, left, x, y, space }: InsetProps) {
    const resolvedTop = top || y || space
    const resolvedRight = right || x || space
    const resolvedBottom = bottom || y || space
    const resolvedLeft = left || x || space

    return (
        <InsetComponent top={resolvedTop} bottom={resolvedBottom} left={resolvedLeft} right={resolvedRight}>
            {children}
        </InsetComponent>
    )
}
