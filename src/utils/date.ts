import * as anchor from '@project-serum/anchor'

export function bnToMs(bn: anchor.BN) {
    return bn.toNumber() * 1000
}

export function bnToSec(bn: anchor.BN) {
    return bn.toNumber()
}

export function bnToDateString(bn: anchor.BN) {
    return new Date(bnToMs(bn)).toISOString().split('.')[0] as string
}

export function adjustTimezoneOffset(ms: number): number {
    const timeOffset = new Date().getTimezoneOffset() * 60 * 1000

    return ms - timeOffset
}

export function msToDateString(
    ms: number,
    { clampSec, adjustTimezone }: { adjustTimezone?: boolean; clampSec?: boolean } = {},
) {
    if (adjustTimezone) {
        ms = adjustTimezoneOffset(ms)
    }

    const date = new Date(ms)

    if (clampSec) {
        date.setSeconds(0)
    }

    return date.toISOString().split('.')[0] as string
}

export function dateStringToMs(date: string) {
    return new Date(date).getTime()
}

export function msToBn(ms: number) {
    return new anchor.BN(Math.floor(ms / 1000))
}

export function secToBn(sec: number) {
    return new anchor.BN(sec)
}

export function addDays(ms: number, days: number) {
    return ms + days * 24 * 60 * 60 * 1000
}

export function addMinutes(ms: number, minutes: number) {
    return ms + minutes * 60 * 1000
}

export function bnToTimezoneDateString(bn: anchor.BN) {
    return msToDateString(bnToMs(bn), { adjustTimezone: true })
}

export function bnToLocaleString(bn: anchor.BN) {
    return new Date(bnToMs(bn)).toLocaleString()
}

export function msToTimeUntil(ms: number) {
    const distance = ms - Date.now()

    const hours = Math.floor(distance / (1000 * 60 * 60)).toString()
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString()
    const seconds = Math.floor((distance % (1000 * 60)) / 1000).toString()

    return [hours, minutes, seconds].map((v) => v.padStart(2, '0')).join(':')
}
