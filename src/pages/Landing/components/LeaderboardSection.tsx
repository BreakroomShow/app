import { Avatar } from '../../../components/Avatar'
import { SegmentComponent } from '../../../components/Segment'
import { Table } from '../../../components/Table'
import { Wallet } from '../../../components/Wallet'
import { Box, Column, Columns, Inline, Media, Stack, Text, Typography } from '../../../design-system'
import { PageSpacer } from './PageSpacer'
import { SectionTitle } from './SectionTitle'

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

export function LeaderboardTable({ collapseBelow }: { collapseBelow?: Extract<Media, `@down-${string}`> }) {
    const mobile = collapseBelow

    return (
        <Table data={users} extractKey={(u) => u.id} collapseBelow={mobile}>
            {[
                {
                    header: mobile ? (
                        <>
                            <Box css={{ display: 'block', [mobile]: { display: 'none' } }}>Solana wallet</Box>
                            <Box css={{ display: 'none', [mobile]: { display: 'block' } }}>Wallet</Box>
                        </>
                    ) : (
                        'Solana wallet'
                    ),
                    width: 1 / 2,
                    render: (u) => (
                        <Inline space="xs" wrap="nowrap">
                            <Avatar src={u.avatarUrl} />
                            <Wallet size={4}>{u.wallet}</Wallet>
                        </Inline>
                    ),
                },
                {
                    header: 'Sol',
                    width: 1 / 4,
                    render: (u) => u.sol,
                },
                {
                    header: 'USD',
                    width: 1 / 4,
                    render: (u) => u.usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                    css: { justifyContent: 'flex-end', ...(mobile && { [mobile]: { justifyContent: 'flex-start' } }) },
                },
            ]}
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
                    <LeaderboardTable collapseBelow="@down-md" />
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
