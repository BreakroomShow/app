import { Box, Column, Columns, Stack, Text, Typography, styled } from '../../../design-system'
import { ReactComponent as HeartIcon } from '../../../images/heart.svg'
import { ReactComponent as QuestionIcon } from '../../../images/question.svg'
import { ReactComponent as TimerIcon } from '../../../images/timer.svg'
import { nbsp } from '../const'
import { PageSpacer } from './PageSpacer'
import { SectionTitle } from './SectionTitle'

const Icon = styled(Box, {
    height: 86,
    width: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
})

export function GameRulesSection() {
    const rules = [
        { icon: <QuestionIcon />, title: '12 questions', description: `4${nbsp}easy, 4${nbsp}middle and 4${nbsp}hard` },
        { icon: <TimerIcon />, title: '10 seconds', description: 'for every question' },
        {
            icon: <HeartIcon style={{ height: 76, width: 88 }} />,
            title: '1 extra life',
            description: 'except for last question',
        },
    ]

    return (
        <Box>
            <Stack align="center" space="sm">
                <SectionTitle>Weekly Live Trivia</SectionTitle>
                <Text font="body" size="md" color="blackA" align="center">
                    Every week there are new questions on different topics and{' '}
                    <span style={{ whiteSpace: 'nowrap' }}>a new prize fund</span>
                </Text>
            </Stack>
            <PageSpacer />
            <Columns space={{ '@all': 'xl', '@down-lg': 'xxl' }} collapseBelow="@down-lg">
                {rules.map((i) => (
                    <Column key={i.title} width={1 / 3}>
                        <Stack space="md" align="center">
                            <Icon>{i.icon}</Icon>
                            <Stack space="xxs">
                                <Typography as="h1" align="center">
                                    {i.title}
                                </Typography>
                                <Text font="body" color="greyA" size="md" align="center">
                                    {i.description}
                                </Text>
                            </Stack>
                        </Stack>
                    </Column>
                ))}
            </Columns>
        </Box>
    )
}
