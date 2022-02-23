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
                        <SectionTitle align="left">Everything is{nbsp}fair</SectionTitle>
                        <Text font="body" size="md" color="blackA">
                            Since the game is built on the blockchain, each winner can be checked. After the trivia, we
                            publish a sheet of winners with their winnings and the opportunity to view each transaction.
                        </Text>
                        <Text font="body" size="md" color="blackA">
                            The sheet will be published after the first game.
                        </Text>
                    </Stack>
                </Content>
            </PageContent>
        </Container>
    )
}
