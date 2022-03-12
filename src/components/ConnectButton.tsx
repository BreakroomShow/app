import { MouseEventHandler, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { analytics } from '../analytics'
import { urls } from '../config'
import { useWallet } from '../containers/ConnectProvider'
import { Box } from '../design-system'
import { ReactComponent as PhantomIcon } from '../images/phantom.svg'
import { extractErrorMessage } from '../utils/error'
import { LinkButton } from './LinkButton'
import { Wallet } from './Wallet'

export function useConnectLink(eventPrefix: string) {
    const wallet = useWallet()
    const location = useLocation()
    const navigate = useNavigate()

    const onConnect: MouseEventHandler<HTMLAnchorElement> = (e) => {
        analytics.logEvent('connect_click', { from: eventPrefix })

        if (!wallet.ready) return
        if (wallet.status === 'connected') return

        wallet
            .connect()
            .then(() => {
                navigate(urls.pages.welcome, { state: { fromApp: true } })
                analytics.logEvent('connect_successful', { from: eventPrefix })
            })
            .catch((err) => {
                analytics.logEvent('connect_failed', { from: eventPrefix, reason: extractErrorMessage(err) })
            })

        e.preventDefault()
    }

    return {
        to: wallet.status === 'connected' ? urls.pages.welcome : urls.pages.connect,
        state: wallet.status === 'connected' ? null : { bgLocation: location },
        onClick: onConnect,
    }
}

export function ConnectButton({ mobileText, eventPrefix }: { mobileText?: string; eventPrefix: string }) {
    const text = 'Sign in to play'

    const wallet = useWallet()
    const connectLinkProps = useConnectLink(eventPrefix)

    const [hoveredOrFocus, setHoveredOrFocused] = useState(false)
    const onFocus = () => setHoveredOrFocused(true)
    const onBlur = () => setHoveredOrFocused(false)
    const onMouseEnter = () => setHoveredOrFocused(true)
    const onMouseLeave = () => setHoveredOrFocused(false)
    useEffect(() => {
        if (wallet.status !== 'connected') {
            setHoveredOrFocused(false)
        }
    }, [wallet.status])

    const onDisconnect = () => {
        wallet.disconnect()
        analytics.logEvent('disconnect_click', { from: eventPrefix })
    }

    if (wallet.status === 'connected') {
        return (
            <LinkButton
                as="button"
                icon={<PhantomIcon />}
                arrow={false}
                {...{ onFocus, onMouseEnter, onBlur, onMouseLeave, onClick: onDisconnect }}
            >
                <span style={{ width: 100, display: 'block' }}>
                    {hoveredOrFocus ? 'Disconnect' : <Wallet>{wallet.publicKey.toString()}</Wallet>}
                </span>
            </LinkButton>
        )
    }

    if (wallet.isPending) {
        return (
            <LinkButton as="button" icon={<PhantomIcon />} arrow={false}>
                Connecting...
            </LinkButton>
        )
    }

    return (
        <LinkButton icon={<PhantomIcon />} {...connectLinkProps}>
            <Box css={{ '@down-sm': { display: 'none' } }}>{text}</Box>
            <Box css={{ '@sm': { display: 'none' } }}>{mobileText || text}</Box>
        </LinkButton>
    )
}
