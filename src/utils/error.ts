import * as anchor from '@project-serum/anchor'

import { triviaIdl } from '../config'

type ProgramErrorName = typeof triviaIdl['errors'] extends Array<infer Error>
    ? Error extends { name: string }
        ? Error['name']
        : never
    : never

export class ProgramError extends anchor.ProgramError {
    constructor(name: ProgramErrorName) {
        const error = triviaIdl.errors.find((err) => err.name === name)

        if (error) {
            super(error.code, error.msg)
        } else {
            super(500, 'Unknown error')
        }
    }
}
