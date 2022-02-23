import { Spacer, Text } from '../../../design-system'
import { nbsp } from '../../../utils/nbsp'
import { PageTitle } from './PageTitle'

export function GoalSection() {
    return (
        <>
            <Text font="body" size="lg" color="blackA" align="center">
                Global goal
            </Text>
            <Spacer size="md" />
            <PageTitle>
                On-chain live trivia is the ultimate first web{nbsp}3{nbsp}app for next 1B people in{nbsp}crypto
            </PageTitle>
            <Spacer size="lg" />
            <Text font="body" size="lg" color="blackA" align="center">
                Breakroom wants to get more people into self-custody and web3 apps
            </Text>
        </>
    )
}
