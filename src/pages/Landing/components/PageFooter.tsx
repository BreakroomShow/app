import { ConnectButton } from '../../../components/ConnectButton'
import { Link } from '../../../components/Link'
import { breakroomEmail, breakroomEmailUrl, faqUrl, githubUrl, sponsorUrl } from '../../../config'
import { Box, TypeGroup, Typography, styled } from '../../../design-system'

const Container = styled('footer', {
    display: 'flex',
    gap: '$xxxl',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    '@down-xl': { flexDirection: 'column' },
    '@down-sm': { alignItems: 'flex-start' },

    color: '$white',

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
        <TypeGroup as="body2">
            <Container>
                <Box>
                    <Link to={breakroomEmailUrl}>
                        <Typography>{breakroomEmail}</Typography>
                    </Link>
                </Box>
                <Box>
                    <Link to={sponsorUrl}>
                        <Typography>Join as a sponsor</Typography>
                    </Link>
                    <Link to={faqUrl}>
                        <Typography>F.A.Q.</Typography>
                    </Link>
                    <Link to={githubUrl}>
                        <Typography>GitHub</Typography>
                    </Link>
                </Box>
                <Box>
                    <ConnectButton />
                </Box>
            </Container>
        </TypeGroup>
    )
}
