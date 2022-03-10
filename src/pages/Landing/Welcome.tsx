import { useEffect, useState } from 'react'

import { useUpdateEmailNotification } from '../../api/mutations'
import { useEmailNotificationQuery } from '../../api/query'
import { InputForm, InputLikeButton } from '../../components/InputForm'
import { urls } from '../../config'
import { usePush } from '../../containers/PushProvider'
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

const inviteLink = 'breakroom.show/?ref=asdasd'

export function Welcome() {
    const push = usePush()

    const emailNotification = useEmailNotificationQuery()
    const updateEmailNotification = useUpdateEmailNotification()

    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!copied) return

        const timer = setTimeout(() => {
            setCopied(false)
        }, 3000)

        return () => clearTimeout(timer)
    }, [copied])

    const shareInvite = async () => {
        try {
            await window.navigator.share({ title: 'Breakroom.show invite', url: inviteLink })
        } catch {
            await navigator.clipboard?.writeText(inviteLink)
            setCopied(true)
        }
    }

    // TODO uncomment after testing
    // if (wallet.status === 'idle') {
    //     return <Navigate to="/" />
    // }

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
                                    type="email"
                                    placeholder="Email"
                                    defaultValue={emailNotification}
                                    onSubmit={(text) => {
                                        updateEmailNotification.mutateAsync(text).then(() => {
                                            // TODO fancy notification
                                            // eslint-disable-next-line no-alert
                                            alert('Updated!')
                                        })
                                    }}
                                />
                                {push.isSupported ? (
                                    <InputLikeButton
                                        onClick={push.enable}
                                        arrow={push.enabled ? 'Enabled' : null}
                                        disabled={push.enabled}
                                    >
                                        Browser notifications
                                    </InputLikeButton>
                                ) : null}
                                <InputLikeButton href={urls.external.bot} target="_blank">
                                    Telegram notifications
                                </InputLikeButton>
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
                                <InputLikeButton arrow={copied ? 'Copied!' : 'Copy link'} onClick={shareInvite}>
                                    {inviteLink}
                                </InputLikeButton>
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
