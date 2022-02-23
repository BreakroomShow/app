import { Text, TextProps } from '../../../design-system'

export function SectionTitle({
    id,
    children,
    color = 'black',
    align = 'center',
}: Pick<TextProps, 'children' | 'color' | 'id' | 'align'>) {
    return (
        <Text id={id} font="heading" color={color} align={align} css={{ fontSize: 50, '@down-lg': { fontSize: 36 } }}>
            {children}
        </Text>
    )
}
