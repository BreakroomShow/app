import { Link } from '../../../components/Link'
import { LinkButton } from '../../../components/LinkButton'
import { Box, TypeGroup, Typography, styled } from '../../../design-system'
import { ReactComponent as PhantomIcon } from '../../../images/phantom.svg'
import { breakroomEmail, breakroomEmailUrl, faqUrl, howItWorksUrl, signinUrl, sponsorUrl } from '../const'

const Container = styled('footer', {
    display: 'flex',
    gap: '$xxxl',
    alignItems: 'center',
    '@down-xl': { flexDirection: 'column' },
    '@down-sm': { alignItems: 'flex-start' },

    '& > *': {
        flexBasis: '33%',
        justifyContent: 'center',
        '&:last-child': {
            display: 'flex',
            justifyContent: 'flex-end',
        },
    },

    '& > *:nth-child(2)': {
        display: 'flex',
        gap: '$xxxl',
        whiteSpace: 'nowrap',
        '@down-sm': {
            flexDirection: 'column',
            order: -1,
        },
    },
})

export function PageFooter() {
    return (
        <TypeGroup as="body2" color="white">
            <Container>
                <Link to={breakroomEmailUrl}>
                    <Typography>{breakroomEmail}</Typography>
                </Link>
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
