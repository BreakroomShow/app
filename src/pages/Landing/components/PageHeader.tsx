import { ConnectButton } from '../../../components/ConnectButton'
import { Link } from '../../../components/Link'
import { urls } from '../../../config'
import { Box, Typography, styled } from '../../../design-system'
import { useHtmlAnchor } from '../../../hooks/useHtmlAnchor'
import { ReactComponent as Logo } from '../../../images/logo.svg'
import { FaqSection } from './FaqSection'

const Container = styled('header', {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    whiteSpace: 'nowrap',

    '& > *': {
        '&:first-child': {
            display: 'flex',
            flexBasis: '40%',
            gap: '$xxxl',
            '@down-lg': { display: 'none' },
        },

        '&:last-child': {
            display: 'flex',
            flexBasis: '40%',
            justifyContent: 'flex-end',
        },
    },
})

export function PageHeader({ eventPrefix }: { eventPrefix: string }) {
    const event = `${eventPrefix}_header`

    return (
        <Container>
            <Box>
                <Link {...useHtmlAnchor(FaqSection.id, '/')} eventPrefix={event}>
                    <Typography>F.A.Q.</Typography>
                </Link>
                <Link to={urls.forms.sponsors} eventPrefix={event}>
                    <Typography>Join as a sponsor</Typography>
                </Link>
            </Box>
            <Box>
                <Link to="/" eventPrefix={event}>
                    <Logo style={{ maxWidth: '40vw' }} />
                </Link>
            </Box>
            <Box>
                <ConnectButton mobileText="Play" eventPrefix={event} />
            </Box>
        </Container>
    )
}
