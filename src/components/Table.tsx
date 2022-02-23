import { ReactNode } from 'react'

import { Box, Column, Columns, Css, Media, Stack, Text, styled } from '../design-system'

const TableContainer = styled(Box, {
    background: '$white',
    height: '100%',
    borderRadius: '$md',
    paddingX: 64,
    paddingY: 50,

    '@down-xxl': {
        paddingX: 46,
        paddingY: 30,
    },
    '@down-md': {
        paddingX: 20,
    },
})
const TableRow = styled(Box, {
    paddingY: 14,
    paddingX: 16,
    '@down-md': {
        padding: 20,
    },
    borderRadius: 28,
    background: '$lightGrey',

    '&:nth-child(2n)': {
        background: '$white',
    },
})
const TableCell = styled(Box, {
    height: 28,
    display: 'flex',
    alignItems: 'center',
})

interface TableProps<T> {
    data: T[]
    children: Array<{
        width: number
        header: ReactNode
        render(d: T): ReactNode
        css?: Css
    }>
    extractKey(d: T): string | number
    collapseBelow?: Extract<Media, `@down-${string}`>
}

const resolveKey = (content: ReactNode, index: number) => (typeof content === 'string' ? content : index)

export function Table<T>({ data, children: columns, extractKey, collapseBelow }: TableProps<T>) {
    const mobile = <V,>(v: V) => (collapseBelow ? { [collapseBelow]: v } : {})

    const headerHorizontal = (
        <TableRow css={mobile({ display: 'none' })}>
            <Columns alignY="center" space="md" collapseBelow={collapseBelow}>
                {columns.map((c, index) => (
                    <Column key={resolveKey(c.header, index)} width={c.width}>
                        <TableCell css={c.css}>
                            <Text font="body" size="md" color="greyA">
                                {c.header}
                            </Text>
                        </TableCell>
                    </Column>
                ))}
            </Columns>
        </TableRow>
    )

    const headerVertical = (
        <Box
            css={{
                display: 'none',
                ...mobile({ display: 'block', width: '25%', flexShrink: 0, marginRight: '$md' }),
            }}
        >
            <Stack space="xs">
                {columns.map((c, index) => (
                    <TableCell key={resolveKey(c.header, index)} css={c.css}>
                        <Text font="body" size="md" color="greyA">
                            {c.header}
                        </Text>
                    </TableCell>
                ))}
            </Stack>
        </Box>
    )

    return (
        <TableContainer>
            {headerHorizontal}
            {data.map((d) => (
                <TableRow key={extractKey(d)}>
                    <Box css={mobile({ display: 'flex' })}>
                        {headerVertical}
                        <Columns
                            alignY="center"
                            space={{ '@all': 'md', ...mobile('xs') }}
                            collapseBelow={collapseBelow}
                        >
                            {columns.map((c, index) => (
                                <Column key={resolveKey(c.header, index)} width={c.width}>
                                    <TableCell css={c.css}>
                                        <Text font="body" size="md" weight="regular">
                                            {c.render(d)}
                                        </Text>
                                    </TableCell>
                                </Column>
                            ))}
                        </Columns>
                    </Box>
                </TableRow>
            ))}
        </TableContainer>
    )
}
