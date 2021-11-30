import { sha256 as jssha256 } from 'js-sha256'

export function sha256(...values: string[]): number[] {
    const encoder = new TextEncoder()

    return Array.from(
        values.reduce(
            (acc, v) => Buffer.from(jssha256([...Array.from(acc), ...Array.from(encoder.encode(v))]), 'hex'),
            Buffer.from([]),
        ),
    )
}
