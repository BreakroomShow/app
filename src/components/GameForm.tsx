import { useEffect, useState } from 'react'

import { GameOptions } from '../api/types'
import { addMinutes, dateStringToMs, msToDateString } from '../utils/date'

interface GameFormProps {
    name?: string
    time?: string
    onSuccess(game: GameOptions, reset: () => void): void
    disabled?: boolean
}

export function GameForm({ name: nameProp, time: timeProp, onSuccess, disabled }: GameFormProps) {
    const [name, setName] = useState(nameProp || '')
    const [time, setTime] = useState(timeProp || '')

    useEffect(() => (timeProp ? setTime(timeProp) : undefined), [timeProp])
    useEffect(() => (nameProp ? setName(nameProp) : undefined), [nameProp])

    function reset() {
        setName('')
        setTime('')
    }

    const validTime = time ? dateStringToMs(time) : null
    const validName = name.trim()

    function save() {
        const startTime = validTime || addMinutes(Date.now(), 1)

        onSuccess({ name: validName, startTime }, reset)
    }

    function validateDate() {
        if (!validTime) return

        const moreThanNow = Math.max(validTime, addMinutes(Date.now(), 1))

        setTime(msToDateString(moreThanNow, { clampSec: true, adjustTimezone: true }))
    }

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <fieldset disabled={disabled}>
                <label>
                    name:{' '}
                    <input
                        style={{ minWidth: 200 }}
                        type="text"
                        placeholder="game name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    starts at:{' '}
                    <input
                        type="datetime-local"
                        onBlur={validateDate}
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </label>
                <br />
                <button type="button" disabled={!validTime || !validName} onClick={save}>
                    save
                </button>
            </fieldset>
        </form>
    )
}
