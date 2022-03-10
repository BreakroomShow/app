import { Navigate } from 'react-router-dom'

import { InputForm, InputLikeButton } from '../../components/InputForm'
import { useWallet } from '../../containers/ConnectProvider'
import { Box, Spacer, Stack, Text, styled } from '../../design-system'
import { nbsp } from '../../utils/nbsp'
import { Page } from './components/Page'
import { PageContent } from './components/PageContent'
import { PageFooter } from './components/PageFooter'
import { PageHeader } from './components/PageHeader'
import { PageLinkButton } from './components/PageLinkButton'
import { SectionTitle } from './components/SectionTitle'

const Container = styled(Box, {
    background: '$white',
    borderRadius: '$lg',
    '@down-md': {
        borderRadius: '$md',
    },
})

const Content = styled(Box, {
    display: 'flex',
    justifyContent: 'space-between',
    '@down-xl': {
        flexDirection: 'column',
    },

    paddingY: 60,
    paddingX: 100,
    '@down-lg': {
        paddingX: 60,
    },
    '@down-sm': {
        paddingX: 30,
    },
})

const inviteLink = 'breakroom.show/?ref=[ту...'

export function Welcome() {
    const wallet = useWallet()

    if (wallet.status === 'idle') {
        return <Navigate to="/" />
    }

    return (
        <Page>
            <PageContent css={{ paddingTop: 70, '@down-lg': { paddingTop: 25 } }}>
                <PageHeader />
                <Spacer size="lg" />
                <Stack align="center" space="sm">
                    <SectionTitle>Great! Wallet connected!</SectionTitle>
                    <Text font="body" size="md" color="blackA" align="center" preserveLinebreaks>
                        Before starting the trivia, you need to{nbsp}check a few things
                    </Text>
                </Stack>
                <Spacer size="lg" />

                <Container>
                    <Content>
                        <Box>
                            <Stack space="xs">
                                <Text font="heading" size={{ '@initial': 'xl', '@lg': 'xxl' }} weight="bold">
                                    Turn on notifications
                                </Text>
                                <Text font="body" size="md" color="black">
                                    And don&apos;t miss the start of the trivia
                                </Text>
                            </Stack>

                            <Spacer size="lg" />

                            <Stack space="md">
                                <InputForm
                                    placeholder="Email"
                                    onSubmit={(text, reset) => {
                                        reset()
                                    }}
                                />
                                <InputLikeButton>Browser notifications</InputLikeButton>
                                <InputLikeButton>Telegram notifications</InputLikeButton>
                            </Stack>
                        </Box>
                        <Spacer size="lg" />
                        <Box css={{ flexBasis: '50%', paddingTop: 12 }}>
                            <Text font="body" size="md" color="blackA" preserveLinebreaks>
                                The game starts at the same time for everyone. Before the start, we wait 1 minute for
                                all participants. After that, you will not be able to enter the trivia as a player.
                                {'\n\n'}
                                You can get notifications by email, in the browser or in telegram.
                            </Text>
                        </Box>
                    </Content>
                </Container>

                <Container>
                    <Content>
                        <Box>
                            <Stack space="xs">
                                <Text font="heading" size={{ '@initial': 'xl', '@lg': 'xxl' }} weight="bold">
                                    Invite friends
                                </Text>
                                <Text font="body" size="md" color="black">
                                    To get extra lives for the trivia
                                </Text>
                            </Stack>

                            <Spacer size="lg" />

                            <Stack space="md">
                                <InputLikeButton arrow="Copy link">{inviteLink}</InputLikeButton>
                            </Stack>
                        </Box>
                        <Spacer size="lg" />
                        <Box css={{ flexBasis: '50%', paddingTop: 12 }}>
                            <Text font="body" size="md" color="blackA" preserveLinebreaks>
                                If you invite a friend and they end up joining, you get an extra life to use in the
                                game. One extra life allows you to keep playing even if you missed a question: answered
                                incorrectly or never answered at all.
                                {'\n\n'}
                                You can only use one life per game. You can’t use extra lives on the 12th question.
                            </Text>
                        </Box>
                    </Content>
                </Container>

                <PageLinkButton to="/TODO">Done!</PageLinkButton>

                <PageFooter />
            </PageContent>
        </Page>
    )
}
