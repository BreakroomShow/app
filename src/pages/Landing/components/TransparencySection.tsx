import { Box, Stack, Text, styled } from '../../../design-system'
import { nbsp } from '../../../utils/nbsp'
import { LeaderboardTable } from './LeaderboardSection'
import { PageBlock } from './PageBlock'
import { PageContent } from './PageContent'
import { SectionTitle } from './SectionTitle'

const Container = styled(PageBlock, {
    paddingY: 148,
    '@down-xl': {
        paddingY: 72,
    },
    overflow: 'hidden',
})

const Content = styled(Box, {
    paddingX: 100,
    '@down-xl': {
        paddingX: 40,
    },

    paddingBottom: 120,
    '@md': {
        paddingBottom: 0,
        paddingRight: '50%',
    },
})

const TableContainer = styled(Box, {
    position: 'absolute',
    width: 520,
    minWidth: '50%',
    left: '55%',

    '@down-md': {
        left: 0,
        top: 'calc(100% - 160px)',
        width: '100%',
        minWidth: 460,
    },

    '& > div': {
        background: '$lightGrey',
    },
})

export function TransparencySection() {
    return (
        <Container variant="light">
            <TableContainer>
                <LeaderboardTable />
            </TableContainer>

            <PageContent>
                <Content>
                    <Stack space="xl">
                        <SectionTitle align="left">Transparent and{nbsp}fair</SectionTitle>
                        <Text font="body" size="md" color="blackA">
                            Since the game is built on the blockchain, you can verify the game integrity: how many
                            people played, how much money we payed out. After the trivia, we publish a sheet of winners
                            with their winnings and links to corresponding transactions.
                        </Text>
                        <Text font="body" size="md" color="blackA">
                            You can use alternative apps to play and win Breakroom. You data and playing history belongs
                            to you, not us.
                        </Text>
                    </Stack>
                </Content>
            </PageContent>
        </Container>
    )
}
