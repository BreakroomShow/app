import '@solana/wallet-adapter-react-ui/styles.css'

import './index.css'

import { StrictMode } from 'react'
import { render } from 'react-dom'

import { AdminApp } from './apps/AdminApp'
import { ConnectProvider } from './containers/ConnectProvider'
import { QueryProvider } from './containers/QueryProvider'

render(
    <StrictMode>
        <ConnectProvider>
            <QueryProvider>
                <AdminApp />
                {/* <UserApp />*/}
            </QueryProvider>
        </ConnectProvider>
    </StrictMode>,
    document.getElementById('root'),
)
