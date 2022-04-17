import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { analytics } from '../analytics'
import { useUpdateEmailNotification } from '../api/mutations'
import { useEmailNotificationQuery } from '../api/query'
import { InputForm, InputLikeButton } from '../components/InputForm'
import { urls } from '../config'
import { useWallet } from '../containers/ConnectProvider'
import { usePush } from '../containers/PushProvider'
import { Box, Page, Spacer, Stack, Text, styled } from '../design-system'
import { useLocationState } from '../hooks/useLocationState'
import { extractErrorMessage } from '../utils/error'
import { nbsp } from '../utils/nbsp'
import { PageContent } from './Landing/components/PageContent'
import { PageFooter } from './Landing/components/PageFooter'
import { PageHeader } from './Landing/components/PageHeader'
import { PageLinkButton } from './Landing/components/PageLinkButton'
import { SectionTitle } from './Landing/components/SectionTitle'

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

const ContentLeft = styled(Box, {
    flex: 1,
    overflow: 'hidden',
    padding: 2,
    margin: -2,
})

const ContentRight = styled(Box, {
    flexBasis: '45%',
    paddingTop: 12,
})

function NotificationSection() {
    const push = usePush()

    useEffect(() => {
        if (!push.isSupported) {
            analytics.logEvent('push_not_supported')
        }
    }, [push.isSupported])

    const emailNotification = useEmailNotificationQuery()
    const updateEmailNotification = useUpdateEmailNotification()

    const emailSubscribed = !!emailNotification

    useEffect(() => {
        if (emailSubscribed) {
            analytics.logEvent('email_has_subscribed')
        }
    }, [emailSubscribed])

    return (
        <Container>
            <Content>
                <ContentLeft>
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
                                updateEmailNotification
                                    .mutateAsync(text)
                                    .then(() => {
                                        // TODO fancy notification
                                        // eslint-disable-next-line no-alert
                                        alert('Updated!')

                                        analytics.logEvent('email_notification_successful', { email: text })
                                    })
                                    .catch((err) => {
                                        analytics.logEvent('email_notification_failed', {
                                            reason: extractErrorMessage(err),
                                        })
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
                        <InputLikeButton
                            href={urls.external.bot}
                            target="_blank"
                            onClick={() => analytics.logEvent('telegram_notification_click')}
                        >
                            Telegram notifications
                        </InputLikeButton>
                    </Stack>
                </ContentLeft>
                <Spacer size="lg" />
                <ContentRight>
                    <Text font="body" size="md" color="blackA" preserveLinebreaks>
                        The game starts at the same time for everyone. Before the start, we wait 1 minute for all
                        participants. After that, you will not be able to enter the trivia as a player.
                        {'\n\n'}
                        You can get notifications by email, in the browser or in telegram.
                    </Text>
                </ContentRight>
            </Content>
        </Container>
    )
}

function InviteSection() {
    const wallet = useWallet()

    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!copied) return

        const timer = setTimeout(() => {
            setCopied(false)
        }, 3000)

        return () => clearTimeout(timer)
    }, [copied])

    if (!wallet.publicKey) return null

    const link = `breakroom.show/?ref=${wallet.publicKey.toString()}`

    const shareInvite = async () => {
        try {
            await window.navigator.share({ title: 'Breakroom.show invite', url: link })
            analytics.logEvent('invite_share_menu_opened')
        } catch {
            await navigator.clipboard?.writeText(link)
            setCopied(true)

            analytics.logEvent('invite_copied')
        }
    }

    return (
        <Container>
            <Content>
                <ContentLeft>
                    <Stack space="xs">
                        <Text font="heading" size={{ '@initial': 'xl', '@lg': 'xxl' }} weight="bold">
                            Invite friends
                        </Text>
                        <Text font="body" size="md" color="black">
                            To get extra lives for the trivia
                        </Text>
                    </Stack>

                    <Spacer size="lg" />

                    <InputLikeButton arrow={copied ? 'Copied!' : 'Copy link'} onClick={shareInvite}>
                        {link}
                    </InputLikeButton>
                </ContentLeft>
                <Spacer size="lg" />
                <ContentRight>
                    <Text font="body" size="md" color="blackA" preserveLinebreaks>
                        If you invite a friend and they end up joining, you get an extra life to use in the game. One
                        extra life allows you to keep playing even if you missed a question: answered incorrectly or
                        never answered at all.
                        {'\n\n'}
                        You can only use one life per game. You can’t use extra lives on the 12th question.
                    </Text>
                </ContentRight>
            </Content>
        </Container>
    )
}

export function Welcome() {
    const wallet = useWallet()

    const { fromApp } = useLocationState()
    useEffect(() => {
        analytics.logEvent('welcome_page_open', { fromApp })
    }, [fromApp])

    if (wallet.status === 'idle') {
        return <Navigate to="/" />
    }

    return (
        <Page>
            <PageContent css={{ paddingTop: 70, '@down-lg': { paddingTop: 25 } }}>
                <PageHeader eventPrefix="welcome" />
                <Spacer size="lg" />
                <Stack align="center" space="sm">
                    <SectionTitle>Great! Wallet connected!</SectionTitle>
                    <Text font="body" size="md" color="blackA" align="center" preserveLinebreaks>
                        Before starting the trivia, you need to{nbsp}check a few things
                    </Text>
                </Stack>
                <Spacer size="lg" />
                <NotificationSection />
                <InviteSection />
                <PageLinkButton>Done!</PageLinkButton>
                <PageFooter eventPrefix="welcome" />
            </PageContent>
        </Page>
    )
}
