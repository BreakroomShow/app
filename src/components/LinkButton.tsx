import { ReactNode } from 'react'
import { LinkProps } from 'react-router-dom'

import { Box, Inline, Inset, Typography } from '../design-system'
import { ReactComponent as ArrowIcon } from '../images/arrow.svg'
import { Link } from './Link'

type LinkButtonProps = Partial<LinkProps> & {
    children: ReactNode
    icon?: ReactNode
}

export function LinkButton({ children, icon, to, ...props }: LinkButtonProps) {
    const content = (
        <Box css={{ overflow: 'hidden', display: 'flex' }}>
            <Inline space="xs" wrap="nowrap">
                {icon ? <Box css={{ display: 'flex', padding: 2 }}>{icon}</Box> : null}
                <Inset top={{ custom: 2 }}>
                    <Typography as="body2">{children}</Typography>
                </Inset>
                <Box css={{ display: 'flex' }}>
                    <ArrowIcon />
                </Box>
            </Inline>
        </Box>
    )

    return to ? (
        <Link to={to} {...props}>
            {content}
        </Link>
    ) : (
        content
    )
}
