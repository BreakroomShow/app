import { Component, ReactNode, isValidElement, useLayoutEffect } from 'react'

import { waitForElement } from '../utils/waitForElement'

function ResetError({ children, reset }: { children: ReactNode; reset: () => void }) {
    useLayoutEffect(reset, [reset])
    return <>{children}</>
}

export class ErrorBoundary extends Component<unknown, { errorOrComponent: null | ReactNode | Error }> {
    constructor(props: unknown) {
        super(props)
        this.state = { errorOrComponent: null }
    }

    static getDerivedStateFromError(error: null | Error | ReactNode) {
        if (process.env.NODE_ENV === 'development') {
            if (isValidElement(error)) {
                waitForElement('iframe:not([title="game replay"])').then((reactOverlay) => reactOverlay.remove())
            }
        }

        return { errorOrComponent: error }
    }

    private resetError = () => this.setState({ errorOrComponent: null })

    public render() {
        const { errorOrComponent } = this.state

        if (errorOrComponent) {
            return isValidElement(errorOrComponent) ? (
                <ResetError reset={this.resetError}>{errorOrComponent}</ResetError>
            ) : (
                <p>Something went wrong</p>
            )
        }

        return this.props.children
    }
}
