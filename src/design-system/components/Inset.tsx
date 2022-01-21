import { ReactNode } from 'react'

import { styled } from '../config'
import { spaceTokens } from '../tokens'
import { Css, Custom, MediaProp, Space } from '../types'
import { isCustom, mapVariantsToStyle, resolveToken } from '../utils'
import { Box } from './Box'

interface InsetProps {
    space?: MediaProp<Space> | Custom<number>
    y?: MediaProp<Space> | Custom<number>
    x?: MediaProp<Space> | Custom<number>
    top?: MediaProp<Space> | Custom<number>
    bottom?: MediaProp<Space> | Custom<number>
    left?: MediaProp<Space> | Custom<number>
    right?: MediaProp<Space> | Custom<number>

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
    let resolvedTop = top || y || space
    let resolvedRight = right || x || space
    let resolvedBottom = bottom || y || space
    let resolvedLeft = left || x || space

    const css: Css = {}

    if (isCustom(resolvedTop)) {
        css.paddingTop = resolvedTop.custom
        resolvedTop = undefined
    }
    if (isCustom(resolvedRight)) {
        css.paddingRight = resolvedRight.custom
        resolvedRight = undefined
    }
    if (isCustom(resolvedBottom)) {
        css.paddingBottom = resolvedBottom.custom
        resolvedBottom = undefined
    }
    if (isCustom(resolvedLeft)) {
        css.paddingLeft = resolvedLeft.custom
        resolvedLeft = undefined
    }

    return (
        <InsetComponent top={resolvedTop} bottom={resolvedBottom} left={resolvedLeft} right={resolvedRight} css={css}>
            {children}
        </InsetComponent>
    )
}
