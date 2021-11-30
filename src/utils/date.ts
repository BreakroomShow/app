import * as anchor from '@project-serum/anchor'

export function bnToMs(bn: anchor.BN) {
    return bn.toNumber() * 1000
}

export function bnToSec(bn: anchor.BN) {
    return bn.toNumber()
}

export function bnToDateString(bn: anchor.BN) {
    return new Date(bnToMs(bn)).toISOString().split('.')[0]
}

export function dateStringToMs(date: string) {
    return new Date(date).getTime()
}

export function msToBn(ms: number) {
    return new anchor.BN(Math.floor(ms / 1000))
}

export function addDays(ms: number, days: number) {
    return ms + days * 24 * 60 * 60 * 1000
}
