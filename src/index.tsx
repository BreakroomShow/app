import '@solana/wallet-adapter-react-ui/styles.css'

import './index.css'

import { StrictMode } from 'react'
import { render } from 'react-dom'

import { AdminApp } from './apps/AdminApp'
import { UserApp } from './apps/UserApp'
import { ConnectProvider } from './containers/ConnectProvider'
import { QueryProvider } from './containers/QueryProvider'

render(
    <StrictMode>
        <ConnectProvider>
            <QueryProvider>{process.env.REACT_APP_ADMIN ? <AdminApp /> : <UserApp />}</QueryProvider>
        </ConnectProvider>
    </StrictMode>,
    document.getElementById('root'),
)
