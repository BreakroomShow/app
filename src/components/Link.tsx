import { Link as LinkBase, LinkProps } from 'react-router-dom'

import { styled } from '../design-system'

function LinkComponent({ to, ...props }: LinkProps) {
    if (typeof to !== 'string' || to.startsWith('/')) {
        return <LinkBase to={to} {...props} />
    }

    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a href={to} target={to.startsWith('mailto') ? '_self' : '_blank'} rel="noreferrer" {...props} />
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
