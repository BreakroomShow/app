import { ReactNode } from 'react'

import { Color, Text } from '../../../design-system'

export function SectionTitle({ children, color = 'black' }: { children: ReactNode; color?: Color }) {
    return (
        <Text font="heading" color={color} align="center" css={{ fontSize: 50, '@down-lg': { fontSize: 36 } }}>
            {children}
        </Text>
    )
}
