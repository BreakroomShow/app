import { ConnectButton } from '../../../components/ConnectButton'
import { Link } from '../../../components/Link'
import { sponsorUrl } from '../../../config'
import { Box, Typography, styled } from '../../../design-system'
import { ReactComponent as Logo } from '../../../images/logo.svg'
import { htmlAnchor } from '../../../utils/htmlAnchor'
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

export function PageHeader() {
    return (
        <Container>
            <Box>
                <Link {...htmlAnchor(FaqSection.id)}>
                    <Typography>F.A.Q.</Typography>
                </Link>
                <Link to={sponsorUrl}>
                    <Typography>Join as a sponsor</Typography>
                </Link>
            </Box>
            <Box>
                <Logo />
            </Box>
            <Box>
                <ConnectButton mobileText="Play" />
            </Box>
        </Container>
    )
}
