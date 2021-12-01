const logged = new Set<string>()

export function logError(message: string) {
    if (logged.has(message)) {
        return
    }

    logged.add(message)
    console.error(message)
}
