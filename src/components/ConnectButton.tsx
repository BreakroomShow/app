import { MouseEventHandler } from 'react'

import { connectUrl } from '../config'
import { useWallet } from '../containers/ConnectProvider'
import { Box } from '../design-system'
import { ReactComponent as PhantomIcon } from '../images/phantom.svg'
import { LinkButton } from './LinkButton'

export function ConnectButton({ mobileText }: { mobileText?: string }) {
    const text = 'Sign in to play'

    const wallet = useWallet()

    if (mobileText) {
        console.log({ r: wallet.ready, w: wallet.status, a: wallet.auth.status })
    }

    const onClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
        if (wallet.ready) {
            wallet.connect()
            e.preventDefault()
        }
    }

    if (wallet.status === 'connected' && wallet.auth.status === 'connected') {
        return <button onClick={() => wallet.disconnect()}>disconnect</button>
    }

    return (
        <LinkButton to={connectUrl} icon={<PhantomIcon />} onClick={onClick}>
            <Box css={{ '@down-sm': { display: 'none' } }}>{text}</Box>
            <Box css={{ '@sm': { display: 'none' } }}>{mobileText || text}</Box>
        </LinkButton>
    )
}
