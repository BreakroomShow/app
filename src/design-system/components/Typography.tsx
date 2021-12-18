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

export function Typography({ as = 'text1', component, ...props }: TypographyProps) {
    return <Text as={component} {...props} {...typography[as]} />
}
