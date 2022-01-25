import { Link } from '../../../components/Link'
import { LinkButton } from '../../../components/LinkButton'
import { Box, TypeGroup, Typography, styled } from '../../../design-system'
import { ReactComponent as PhantomIcon } from '../../../images/phantom.svg'
import { breakroomEmail, breakroomEmailUrl, faqUrl, howItWorksUrl, signinUrl, sponsorUrl } from '../const'

const Container = styled('footer', {
    display: 'flex',
    gap: '$xxxl',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    '@down-xl': { flexDirection: 'column' },
    '@down-sm': { alignItems: 'flex-start' },

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

export function PageFooter() {
    return (
        <TypeGroup as="body2" color="white">
            <Container>
                <Box>
                    <Link to={breakroomEmailUrl}>
                        <Typography>{breakroomEmail}</Typography>
                    </Link>
                </Box>
                <Box>
                    <Link to={howItWorksUrl}>
                        <Typography>How it works</Typography>
                    </Link>
                    <Link to={sponsorUrl}>
                        <Typography>Join as a sponsor</Typography>
                    </Link>
                    <Link to={faqUrl}>
                        <Typography>F.A.Q.</Typography>
                    </Link>
                </Box>
                <Box css={{ color: '$white' }}>
                    <LinkButton to={signinUrl} icon={<PhantomIcon />}>
                        Sign in to play
                    </LinkButton>
                </Box>
            </Container>
        </TypeGroup>
    )
}
