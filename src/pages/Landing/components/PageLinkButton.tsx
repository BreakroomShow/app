import { ComponentProps } from 'react'

import { Link } from '../../../components/Link'
import { LinkButton } from '../../../components/LinkButton'
import { SegmentComponent } from '../../../components/Segment'

export function PageLinkButton({ children, ...props }: ComponentProps<typeof Link>) {
    return (
        <Link css={{ borderRadius: '$pill', color: '$black' }} {...props}>
            <SegmentComponent
                inset="center"
                variant="pill"
                css={{
                    background: '$brightGreen',
                    minHeight: 225,
                    '@down-md': { minHeight: 125 },
                }}
            >
                <LinkButton as="div">{children}</LinkButton>
            </SegmentComponent>
        </Link>
    )
}
