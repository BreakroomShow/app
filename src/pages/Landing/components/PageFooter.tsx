import { ConnectButton } from '../../../components/ConnectButton'
import { Link } from '../../../components/Link'
import { urls } from '../../../config'
import { Box, Typography, styled } from '../../../design-system'
import { useHtmlAnchor } from '../../../hooks/useHtmlAnchor'
import { FaqSection } from './FaqSection'

const Container = styled('footer', {
    display: 'flex',

    paddingY: 80,

    gap: '$xxxl',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    '@down-xl': { flexDirection: 'column' },
    '@down-sm': { alignItems: 'flex-start' },

    color: '$black',

    '& > *': {
        display: 'flex',
        flexBasis: '33%',

        '&:nth-child(2)': {
            gap: '$xxxl',

            '@down-sm': {
                flexDirection: 'column',
                order: -1,
            },
        },

        '&:last-child': {
            justifyContent: 'flex-end',
        },
    },
})

export function PageFooter({ eventPrefix }: { eventPrefix: string }) {
    const event = `${eventPrefix}_footer`

    return (
        <Container>
            <Box>
                <Link to={urls.emails.breakroom.toUrl()} eventPrefix={event}>
                    <Typography>{urls.emails.breakroom}</Typography>
                </Link>
            </Box>
            <Box>
                <Link to={urls.forms.sponsors} eventPrefix={event}>
                    <Typography>Join as a sponsor</Typography>
                </Link>
                <Link {...useHtmlAnchor(FaqSection.id, '/')} eventPrefix={event}>
                    <Typography>F.A.Q.</Typography>
                </Link>
                <Link to={urls.external.github} eventPrefix={event}>
                    <Typography>GitHub</Typography>
                </Link>
            </Box>
            <Box>
                <ConnectButton eventPrefix={event} />
            </Box>
        </Container>
    )
}
