import { StrictMode } from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { ConnectProvider } from './containers/ConnectProvider'
import { PushProvider } from './containers/PushProvider'
import { QueryProvider } from './containers/QueryProvider'
import { StyleProvider } from './design-system'
import { Landing } from './pages/Landing'
import { lazy as lazyComponent } from './utils/lazy'

const lazy: typeof lazyComponent = (fn, fallback = null, preloadable = false) =>
    lazyComponent(fn, fallback, preloadable)

const AdminApp = lazy(() => import(/* webpackChunkName: "AdminApp" */ './pages/AdminApp').then((m) => m.AdminApp))
const UserApp = lazy(() => import(/* webpackChunkName: "UserApp" */ './pages/UserApp').then((m) => m.UserApp))
// const Landing = lazy(() => import(/* webpackChunkName: "Landing" */ './pages/Landing').then((m) => m.Landing))

const apps = {
    admin: AdminApp,
    user: UserApp,
    landing: Landing,

    default: () => <p>Wrong app target</p>,
}

const App = apps[process.env.REACT_APP_TARGET as keyof typeof apps] || apps.default

render(
    <StrictMode>
        <StyleProvider>
            <BrowserRouter>
                <ConnectProvider>
                    <QueryProvider>
                        <PushProvider>
                            <App />
                        </PushProvider>
                    </QueryProvider>
                </ConnectProvider>
            </BrowserRouter>
        </StyleProvider>
    </StrictMode>,
    document.getElementById('root'),
)
