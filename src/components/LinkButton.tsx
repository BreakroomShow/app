import { ComponentProps, ReactNode } from 'react'
import { LinkProps as LinkPropsBase } from 'react-router-dom'

import { Box, Inline, Inset, Typography, styled } from '../design-system'
import { ReactComponent as ArrowIcon } from '../images/arrow.svg'
import { Link } from './Link'

type LinkProps = LinkPropsBase & { as?: undefined }
type DivProps = ComponentProps<typeof Box> & { to?: undefined; as: 'div' }
type ButtonProps = ComponentProps<'button'> & { to?: undefined; as: 'button' }

type LinkButtonProps = (LinkProps | DivProps | ButtonProps) & {
    children: ReactNode
    icon?: ReactNode
    arrow?: boolean
}

const Container = styled(Box, {
    all: 'unset',
    overflow: 'hidden',
    display: 'flex',
    outline: 'revert',
})

export function LinkButton({ as, children, icon, arrow = true, ...props }: LinkButtonProps) {
    const content = (
        <Container
            as={as}
            css={{ cursor: as === 'div' ? undefined : 'pointer' }}
            {...(props.to ? {} : { ...(props as DivProps) })}
        >
            <Inline space="xs" wrap="nowrap">
                {icon ? <Box css={{ display: 'flex', padding: 2 }}>{icon}</Box> : null}
                <Inset top={{ custom: 2 }}>
                    <Typography as="body2">{children}</Typography>
                </Inset>
                {arrow ? (
                    <Box css={{ display: 'flex' }}>
                        <ArrowIcon />
                    </Box>
                ) : null}
            </Inline>
        </Container>
    )

    return props.to ? <Link {...props}>{content}</Link> : content
}
