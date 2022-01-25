export function exhaustiveCheck(value: never): asserts value is never {
    throw new Error(`Unhandled value ${value}`)
}
