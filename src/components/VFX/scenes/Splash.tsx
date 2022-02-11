import { Suspense } from 'react'

import { SparkStorm } from '../components/SparkStorm'
import Text from '../components/Text'
import { colors } from '../helpers/constants'

export const Splash = () => (
    <Suspense fallback={null}>
        <Text>Breakroom Show</Text>
        <SparkStorm count={500} colors={colors.trivia} />
    </Suspense>
)
