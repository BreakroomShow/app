import { Suspense } from 'react'

import { Sparks } from '../components/Sparks'
import { Text } from '../components/Text'
import { colors } from '../helpers/constants'

export const Splash = () => (
    <Suspense fallback={null}>
        <Text>Breakroom Show</Text>
        <Sparks count={15} colors={colors.sparks} />
    </Suspense>
)
