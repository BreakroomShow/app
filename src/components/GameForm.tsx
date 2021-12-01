import { useState } from 'react'

import { addDays, dateStringToMs } from '../utils/date'

interface GameFormProps {
    name?: string
    time?: string
    onSuccess(game: { name: string; startTime: number }, reset: () => void): void
}

export function GameForm({ name: nameProp, time: timeProp, onSuccess }: GameFormProps) {
    const [name, setName] = useState(nameProp || '')
    const [time, setTime] = useState(timeProp || '')

    function reset() {
        setName('')
        setTime('')
    }

    const validTime = time ? dateStringToMs(time) : null
    const validName = name.trim()

    function save() {
        onSuccess({ name: validName, startTime: validTime || addDays(Date.now(), 1) }, reset)
    }

    return (
        <div>
            <input
                style={{ minWidth: 200 }}
                type="text"
                placeholder="game name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <br />
            <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
            <br />
            <button disabled={!validTime || !validName} onClick={save}>
                save
            </button>
        </div>
    )
}
