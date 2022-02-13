export function selectRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)] as T
}

export function randomFloat(min: number, max: number) {
    return Math.random() * (max - min + 1) + min
}
