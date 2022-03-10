import { ComponentProps, ReactNode } from 'react'
import { LinkProps } from 'react-router-dom'

import { Box, Inline, Inset, Typography, styled } from '../design-system'
import { ReactComponent as ArrowIcon } from '../images/arrow.svg'
import { Link } from './Link'

type DivProps = ComponentProps<typeof Box> & { to?: never }

type LinkButtonProps = (LinkProps | DivProps) & {
    as?: keyof JSX.IntrinsicElements
    children: ReactNode
    icon?: ReactNode
}

const Container = styled(Box, {
    all: 'unset',
    overflow: 'hidden',
    display: 'flex',
    cursor: 'pointer',
    outline: 'revert',
})

export function LinkButton({ as, children, icon, ...props }: LinkButtonProps) {
    const content = (
        <Container as={as || (props.to ? 'div' : 'button')} {...(props.to ? {} : { ...(props as DivProps) })}>
            <Inline space="xs" wrap="nowrap">
                {icon ? <Box css={{ display: 'flex', padding: 2 }}>{icon}</Box> : null}
                <Inset top={{ custom: 2 }}>
                    <Typography as="body2">{children}</Typography>
                </Inset>
                {props.to ? (
                    <Box css={{ display: 'flex' }}>
                        <ArrowIcon />
                    </Box>
                ) : null}
            </Inline>
        </Container>
    )

    return props.to ? <Link {...props}>{content}</Link> : content
}
