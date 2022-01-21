import { useCallback, useState } from 'react'

type Setter<T> = (stored: T) => T
type Dispatch<T> = (setterOrValue: T | Setter<T>) => void

const isFunction = (value: unknown): value is Function => typeof value === 'function'

const storageVersion = 'v1'

export function useLocalStorage<T>(key: string, initialValue: T) {
    const storageKey = `${storageVersion}:${key}`

    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(storageKey)

            return item ? JSON.parse(item) : initialValue
        } catch (e) {
            return initialValue
        }
    })

    const setValue: Dispatch<T> = useCallback(
        (setterOrValue) => {
            try {
                setStoredValue((stored) => {
                    const valueToStore = isFunction(setterOrValue) ? setterOrValue(stored) : setterOrValue

                    window.localStorage.setItem(storageKey, JSON.stringify(valueToStore))

                    return valueToStore
                })
            } catch (e) {
                console.warn(e)
            }
        },
        [storageKey],
    )

    return [storedValue, setValue] as const
}
