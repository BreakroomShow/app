import { ReactNode } from 'react'

import { globalCss } from '../../../design-system'

const styles = globalCss({
    html: { background: '$background' },
    body: { background: '$background', color: '$black' },
})

export function Page({ children }: { children: ReactNode }) {
    styles()
    return <>{children}</>
}
