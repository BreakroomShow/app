import { Link } from '../../../components/Link'
import { LinkButton } from '../../../components/LinkButton'
import { Box, Text, TypeGroup, Typography, styled } from '../../../design-system'
import { ReactComponent as PhantomIcon } from '../../../images/phantom.svg'
import { faqUrl, signinUrl, sponsorUrl } from '../const'

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
                    <LinkButton to={signinUrl} icon={<PhantomIcon />}>
                        <Box css={{ '@down-sm': { display: 'none' } }}>Sign in to play</Box>
                        <Box css={{ '@sm': { display: 'none' } }}>Play</Box>
                    </LinkButton>
                </Box>
            </Container>
        </TypeGroup>
    )
}
