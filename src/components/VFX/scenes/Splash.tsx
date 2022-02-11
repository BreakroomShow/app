import { Suspense } from 'react'

import Text from '../components/Text'

export const Splash = () => {
    return (
        <Suspense fallback={null}>
            <Text>Breakroom Show</Text>
        </Suspense>
    )
}
