import { ComponentProps, ComponentType } from 'react'

import { Link } from '../../../components/Link'
import { LinkButton } from '../../../components/LinkButton'
import { SegmentComponent } from '../../../components/Segment'
import { Box } from '../../../design-system'

export function PageLinkButton({
    children,
    ...props
}: ComponentProps<typeof Link> | (ComponentProps<typeof Box> & { to?: undefined })) {
    const Component: ComponentType = props.to ? Link : Box

    return (
        <Component css={{ borderRadius: '$pill', color: '$black' }} {...props}>
            <SegmentComponent
                inset="center"
                variant="pill"
                css={{ background: '$brightGreen', minHeight: 225, '@down-md': { minHeight: 125 } }}
            >
                <LinkButton as="div" arrow={!!props.to}>
                    {children}
                </LinkButton>
            </SegmentComponent>
        </Component>
    )
}
