import { ReactNode, createContext, useMemo } from 'react'

import { alignYToFlexAlign, mapPropToStyle, mapVariantsToStyle } from '../utils'
import { Box } from './Box'
import { Align, AlignY, Media, MediaProp, Space, alignYTokens, styled } from '..'

export interface ColumnsProps {
    children: ReactNode
    alignY?: MediaProp<AlignY>
    align?: MediaProp<Align>
    space?: MediaProp<Space>
    collapseBelow?: Extract<Media, `@down-${string}`>
    collapseAbove?: Exclude<Media, `@down-${string}` | '@all'>
}

export const SpaceContext = createContext<Pick<
    ColumnsProps,
    'space' | 'collapseBelow' | 'collapseAbove' | 'align'
> | null>(null)

const ColumnsContainer = styled(Box, {
    display: 'flex',
    flexDirection: 'row',
    variants: {
        alignY: mapVariantsToStyle(alignYTokens, (alignY) => ({
            alignItems: mapPropToStyle(alignY, alignYToFlexAlign),
        })),
    },
})

export function Columns({ children, align, alignY, space, collapseBelow, collapseAbove }: ColumnsProps) {
    const css = useMemo(() => {
        return {
            ...(collapseBelow && { [collapseBelow]: { display: 'block' } }),
            ...(collapseAbove && { [collapseAbove]: { display: 'block' } }),
        }
    }, [collapseAbove, collapseBelow])

    const ctx = useMemo(
        () => ({ space, collapseBelow, collapseAbove, align }),
        [align, collapseAbove, collapseBelow, space],
    )

    return (
        <SpaceContext.Provider value={ctx}>
            <ColumnsContainer alignY={alignY} css={css}>
                {children}
            </ColumnsContainer>
        </SpaceContext.Provider>
    )
}
