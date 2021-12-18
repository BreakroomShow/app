import '@solana/wallet-adapter-react-ui/styles.css'

import { StrictMode } from 'react'
import { render } from 'react-dom'

import { AdminApp } from './AdminApp'
import { ConnectProvider } from './containers/ConnectProvider'
import { QueryProvider } from './containers/QueryProvider'
import { StyleProvider } from './design-system'
import { UserApp } from './UserApp'

render(
    <StrictMode>
        <StyleProvider>
            <ConnectProvider>
                <QueryProvider>{process.env.REACT_APP_ADMIN ? <AdminApp /> : <UserApp />}</QueryProvider>
            </ConnectProvider>
        </StyleProvider>
    </StrictMode>,
    document.getElementById('root'),
)
