import { MouseEvent } from 'react'
import { Link as LinkBase, LinkProps } from 'react-router-dom'

import { analytics } from '../analytics'
import { styled } from '../design-system'

function LinkComponent({
    to,
    state,
    onClick: onClickProp,
    children,
    eventPrefix,
    ...props
}: LinkProps & { eventPrefix?: string }) {
    const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (onClickProp) onClickProp(e)

        analytics.logEvent('link_click', { link: to, from: eventPrefix })
    }

    if (typeof to !== 'string' || to.startsWith('/')) {
        return (
            <LinkBase to={to} state={{ ...state, fromApp: true }} {...props} onClick={onClick}>
                {children}
            </LinkBase>
        )
    }

    return (
        <a
            href={to}
            target={to.startsWith('mailto') ? '_self' : '_blank'}
            rel="noreferrer"
            {...props}
            onClick={onClick}
        >
            {children}
        </a>
    )
}

export const Link = styled(LinkComponent, {
    textDecoration: 'none',

    variants: {
        underline: {
            true: { textDecoration: 'underline' },
        },
        wrap: {
            wrap: {},
            nowrap: { whiteSpace: 'nowrap' },
        },
    },
})
