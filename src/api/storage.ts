const version = 'v1'

export function set(key: string, value: unknown = null) {
    localStorage.setItem(`${version}:${key}`, JSON.stringify(value))
}

export function get<T>(key: string, defaultValue: T): T
export function get<T>(key: string): T | null
export function get<T>(key: string, defaultValue?: T): T | null {
    const value = defaultValue ?? null

    try {
        const item = window.localStorage.getItem(`${version}:${key}`)
        return item ? JSON.parse(item) : value
    } catch (e) {
        return value
    }
}
