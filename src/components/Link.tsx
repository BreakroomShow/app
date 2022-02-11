import { Link as LinkBase, LinkProps, useLocation } from 'react-router-dom'

import { styled } from '../design-system'

function LinkComponent({ to, state, ...props }: LinkProps) {
    const location = useLocation()

    if (typeof to !== 'string' || to.startsWith('/')) {
        return <LinkBase to={to} state={{ bgLocation: location, ...state }} {...props} />
    }

    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a href={to} target="_blank" rel="noreferrer" {...props} />
}

export const Link = styled(LinkComponent, {
    textDecoration: 'none',

    variants: {
        underline: {
            true: { textDecoration: 'underline' },
        },
    },
})
