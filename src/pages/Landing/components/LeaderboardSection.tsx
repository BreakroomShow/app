import { SegmentComponent } from '../../../components/Segment'
import { Wallet } from '../../../components/Wallet'
import { Box, Column, Columns, Inline, Stack, Text, Typography, styled } from '../../../design-system'
import { PageSpacer } from './PageSpacer'
import { SectionTitle } from './SectionTitle'

const Table = styled(Box, {
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

    '&:nth-child(2n)': {
        background: '#DFDCD240',
    },
})

const TableCell = styled(Box, {
    height: 28,
    display: 'flex',
    alignItems: 'center',
})

const Avatar = styled('img', {
    size: 28,
    borderRadius: 100,
})

function LeaderboardTable() {
    /* prettier-ignore */
    const users = [
        { sol: 120.56, usd: 2590.23, wallet: '3gr79GtS9FrmvT1FaK2UZEjL7zvNchorJFRzhZh9LxSD', avatarUrl: 'https://solpunks.com/wp-content/uploads/2021/05/nerd-glasses.png' },
        { sol: 420.56, usd: 90.23, wallet: '3QHyePJUy48Ac38MbNegx8mkDZBMZzHw6gJbPCFRhBRA', avatarUrl: 'https://solpunks.com/wp-content/uploads/2021/05/black-lipstick.png' },
        { sol: 0.56, usd: 590.23, wallet: '3QHyePJUy48Ac38MbNegx8mkDZBMZzHw6gJbPCFRhBRA', avatarUrl: 'https://solpunks.com/wp-content/uploads/2021/05/regular-shades.png' },
        { sol: 220.56, usd: 14590.23, wallet: '3gr79GtS9FrmvT1FaK2UZEjL7zvNchorJFRzhZh9LxSD', avatarUrl: 'https://solpunks.com/wp-content/uploads/2021/05/shadow-beard.png' },
        { sol: 120.56, usd: 2590.23, wallet: '3gr79GtS9FrmvT1FaK2UZEjL7zvNchorJFRzhZh9LxSD', avatarUrl: 'https://solpunks.com/wp-content/uploads/2021/05/nerd-glasses.png' },
        { sol: 420.56, usd: 90.23, wallet: '3QHyePJUy48Ac38MbNegx8mkDZBMZzHw6gJbPCFRhBRA', avatarUrl: 'https://solpunks.com/wp-content/uploads/2021/05/black-lipstick.png' },
        { sol: 0.56, usd: 590.23, wallet: '3QHyePJUy48Ac38MbNegx8mkDZBMZzHw6gJbPCFRhBRA', avatarUrl: 'https://solpunks.com/wp-content/uploads/2021/05/regular-shades.png' },
        { sol: 220.56, usd: 14590.23, wallet: '3gr79GtS9FrmvT1FaK2UZEjL7zvNchorJFRzhZh9LxSD', avatarUrl: 'https://solpunks.com/wp-content/uploads/2021/05/shadow-beard.png' },
        { sol: 120.56, usd: 2590.23, wallet: '3gr79GtS9FrmvT1FaK2UZEjL7zvNchorJFRzhZh9LxSD', avatarUrl: 'https://solpunks.com/wp-content/uploads/2021/05/nerd-glasses.png' },
        { sol: 420.56, usd: 90.23, wallet: '3QHyePJUy48Ac38MbNegx8mkDZBMZzHw6gJbPCFRhBRA', avatarUrl: 'https://solpunks.com/wp-content/uploads/2021/05/black-lipstick.png' },
        { sol: 0.56, usd: 590.23, wallet: '3QHyePJUy48Ac38MbNegx8mkDZBMZzHw6gJbPCFRhBRA', avatarUrl: 'https://solpunks.com/wp-content/uploads/2021/05/regular-shades.png' },
        { sol: 220.56, usd: 14590.23, wallet: '3gr79GtS9FrmvT1FaK2UZEjL7zvNchorJFRzhZh9LxSD', avatarUrl: 'https://solpunks.com/wp-content/uploads/2021/05/shadow-beard.png' },
    ].map((u, i) => ({...u, id: i}))

    const mobile = '@down-md'
    const desktop = '@md'

    const headerHorizontal = (
        <TableRow css={{ [mobile]: { display: 'none' } }}>
            <Columns alignY="center" space="md" collapseBelow={mobile}>
                <Column width={2 / 4}>
                    <Text font="body" size="md" color="greyA">
                        Solana wallet
                    </Text>
                </Column>
                <Column width={1 / 4}>
                    <TableCell>
                        <Text font="body" size="md" color="greyA">
                            SOL
                        </Text>
                    </TableCell>
                </Column>
                <Column width={1 / 4}>
                    <TableCell css={{ [desktop]: { justifyContent: 'flex-end' } }}>
                        <Text font="body" size="md" color="greyA">
                            USD
                        </Text>
                    </TableCell>
                </Column>
            </Columns>
        </TableRow>
    )

    const headerVertical = (
        <Box css={{ width: '25%', flexShrink: 0, marginRight: '$md', [desktop]: { display: 'none' } }}>
            <Stack space="xs">
                <TableCell>
                    <Text font="body" size="md" color="greyA">
                        Wallet
                    </Text>
                </TableCell>
                <TableCell>
                    <Text font="body" size="md" color="greyA">
                        SOL
                    </Text>
                </TableCell>
                <TableCell css={{ [desktop]: { justifyContent: 'flex-end' } }}>
                    <Text font="body" size="md" color="greyA">
                        USD
                    </Text>
                </TableCell>
            </Stack>
        </Box>
    )

    return (
        <Table>
            {headerHorizontal}
            {users.map((u) => (
                <TableRow key={u.id}>
                    <Box css={{ [mobile]: { display: 'flex' } }}>
                        {headerVertical}
                        <Columns alignY="center" space={{ '@all': 'md', [mobile]: 'xs' }} collapseBelow={mobile}>
                            <Column width={2 / 4}>
                                <Box css={{ lineHeight: 0 }}>
                                    <Inline space="xs" wrap="nowrap">
                                        <Avatar src={u.avatarUrl} />
                                        <TableCell title={u.wallet}>
                                            <Text font="body" size="md" weight="regular">
                                                <Wallet size={4}>{u.wallet}</Wallet>
                                            </Text>
                                        </TableCell>
                                    </Inline>
                                </Box>
                            </Column>
                            <Column width={1 / 4}>
                                <TableCell>
                                    <Text font="body" size="md" weight="regular">
                                        {u.sol}
                                    </Text>
                                </TableCell>
                            </Column>
                            <Column width={1 / 4}>
                                <TableCell css={{ [desktop]: { justifyContent: 'flex-end' } }}>
                                    <Text font="body" size="md" weight="regular">
                                        {u.usd.toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                        })}
                                    </Text>
                                </TableCell>
                            </Column>
                        </Columns>
                    </Box>
                </TableRow>
            ))}
        </Table>
    )
}

export function LeaderboardSection() {
    const info = [
        { color: 'pink', title: '$106,56', description: 'maximum prize' },
        { color: 'lightBlue', title: '$10,75', description: 'minimum prize' },
        { color: 'brightGreen', title: '$1000', description: 'maximum prize fund' },
    ]

    return (
        <Box>
            <SectionTitle color="white">Leaderboard</SectionTitle>
            <PageSpacer />
            <Columns collapseBelow="@down-xl">
                <Column width={2 / 3}>
                    <LeaderboardTable />
                </Column>
                <Column width={1 / 3}>
                    {info.map((i) => (
                        <SegmentComponent
                            key={i.color}
                            inset="center"
                            variant="pill"
                            css={{
                                background: `$${i.color}`,
                                height: '33.333%',
                                minHeight: 200,
                                '@down-md': { minHeight: 145 },
                            }}
                        >
                            <Stack align="center">
                                <Text
                                    font="heading"
                                    size={{ '@all': 'xxxl', '@down-md': 'xxl' }}
                                    color="black"
                                    align="center"
                                >
                                    {i.title}
                                </Text>
                                <Typography as="text1" color="greyA" align="center">
                                    {i.description}
                                </Typography>
                            </Stack>
                        </SegmentComponent>
                    ))}
                </Column>
            </Columns>
        </Box>
    )
}
