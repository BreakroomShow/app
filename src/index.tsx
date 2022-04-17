import { StrictMode } from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { App } from './App'
import { isAdmin } from './config'
import { ContextProvider } from './containers/ContextProvider'
import { ErrorBoundary } from './containers/ErrorBoundary'
import { lazy } from './utils/lazy'

const AdminApp = lazy(() => import(/* webpackChunkName: "AdminApp" */ './AdminApp').then((m) => m.AdminApp), null)

render(
    <StrictMode>
        <BrowserRouter>
            <ErrorBoundary>
                <ContextProvider>{isAdmin ? <AdminApp /> : <App />}</ContextProvider>
            </ErrorBoundary>
        </BrowserRouter>
    </StrictMode>,
    document.getElementById('root'),
)
