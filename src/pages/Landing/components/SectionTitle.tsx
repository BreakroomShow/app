import { Text, TextProps } from '../../../design-system'

export function SectionTitle({ id, children, color = 'black' }: Pick<TextProps, 'children' | 'color' | 'id'>) {
    return (
        <Text id={id} font="heading" color={color} align="center" css={{ fontSize: 50, '@down-lg': { fontSize: 36 } }}>
            {children}
        </Text>
    )
}
