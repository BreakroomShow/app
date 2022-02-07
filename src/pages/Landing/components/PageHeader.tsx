import { ConnectButton } from '../../../components/ConnectButton'
import { Link } from '../../../components/Link'
import { faqUrl, sponsorUrl } from '../../../config'
import { Box, Text, TypeGroup, Typography, styled } from '../../../design-system'

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
        <TypeGroup as="body2">
            <Container>
                <Box>
                    <Link to={faqUrl}>
                        <Typography>F.A.Q.</Typography>
                    </Link>
                    <Link to={sponsorUrl}>
                        <Typography>Join as a sponsor</Typography>
                    </Link>
                </Box>
                <Text color="orange" size="xl" align="center">
                    breakroom
                </Text>
                <Box>
                    <ConnectButton mobileText="Play" />
                </Box>
            </Container>
        </TypeGroup>
    )
}
