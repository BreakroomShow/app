import * as anchor from '@project-serum/anchor'
import * as trivia from 'clic-trivia'

type ProgramErrorName = trivia.Trivia['errors'] extends Array<infer Error>
    ? Error extends { name: string }
        ? Error['name']
        : never
    : never

export class ProgramError extends anchor.ProgramError {
    constructor(name: ProgramErrorName, message?: string) {
        const error = trivia.IDL.errors.find((err) => err.name === name)

        if (error) {
            super(error.code, message || error.msg)
        } else {
            super(500, message || 'Unknown error')
        }
    }
}
