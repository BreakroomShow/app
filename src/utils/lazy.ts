import * as React from 'react'

export function lazy<T extends React.ComponentType<any>>(
    importFn: () => Promise<T>,
    fallback?: React.ReactNode,
    preloadable?: boolean,
): React.ExoticComponent<React.ComponentPropsWithRef<T>> {
    const factory = async () => ({ default: await importFn() })

    const LazyComponent = React.lazy(factory)
    let LoadedComponent: T

    const Component: React.ExoticComponent<React.ComponentPropsWithRef<T>> = React.forwardRef((props, ref) => {
        const element = React.createElement(LoadedComponent || LazyComponent, {
            ...props,
            ref,
        })

        if (fallback === undefined) {
            return element
        }

        return React.createElement(React.Suspense, { fallback }, element)
    })

    if (preloadable) {
        factory().then((module) => {
            LoadedComponent = module.default
        })
    }

    return Component
}
