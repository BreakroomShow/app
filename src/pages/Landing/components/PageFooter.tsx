import { ConnectButton } from '../../../components/ConnectButton'
import { Link } from '../../../components/Link'
import { breakroomEmail, breakroomEmailUrl, githubUrl, sponsorUrl } from '../../../config'
import { Box, Typography, styled } from '../../../design-system'
import { htmlAnchor } from '../../../utils/htmlAnchor'
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

export function PageFooter() {
    return (
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
                <Link {...htmlAnchor(FaqSection.id)}>
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
    )
}
