import { createClient } from '@supabase/supabase-js'
import { VercelRequest, VercelResponse } from '@vercel/node'
import * as joi from 'joi'

import { UnrevealedQuestion } from '../src/types'

if (typeof process.env.SUPABASE_URL === 'undefined' || typeof process.env.SUPABASE_KEY === 'undefined') {
    throw new Error('Provide SUPABASE_URL and SUPABASE_KEY')
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const GetUnrevealedQuestionParamsSchema = joi.array().required().items(joi.string())

function selectUnrevealedQuestions(questionKeys: string[]) {
    return supabase
        .from<UnrevealedQuestion>('questions')
        .select('*')
        .in('publicKey', questionKeys)
        .then((res) => res.data || [])
}

async function get(req: VercelRequest, res: VercelResponse) {
    let questionKeys = req.query.questionKeys || []
    questionKeys = Array.isArray(questionKeys) ? questionKeys : [questionKeys]

    const { error } = GetUnrevealedQuestionParamsSchema.validate(questionKeys)

    if (error) {
        return res.status(400).json({
            error: 'Wrong parameters',
            details: error.toString(),
        })
    }

    const result = await selectUnrevealedQuestions(questionKeys)

    res.status(200).json(result)
}

const PostUnrevealedQuestionParamsSchema = joi
    .object({
        publicKey: joi.string().required(),
        name: joi.string().required(),
        variants: joi.array().required().length(3).items(joi.string()),
    })
    .required()

function insertUnrevealedQuestion(question: UnrevealedQuestion) {
    return supabase.from<UnrevealedQuestion>('questions').insert(question).single()
}

async function post(req: VercelRequest, res: VercelResponse) {
    const { error } = PostUnrevealedQuestionParamsSchema.validate(req.body)

    if (error) {
        return res.status(400).json({
            error: 'Wrong parameters',
            details: error.toString(),
        })
    }

    const { error: dbError, status, data } = await insertUnrevealedQuestion(req.body)

    if (dbError) {
        return res.status(status).json({
            error: "Can't save UnrevealedQuestion",
            details: dbError.message,
        })
    }

    res.status(status).json(data)
}

function deleteUnrevealedQuestion(questionKey: string) {
    return supabase.from<UnrevealedQuestion>('questions').delete().eq('publicKey', questionKey)
}

async function del(req: VercelRequest, res: VercelResponse) {
    const { error } = joi.string().required().validate(req.query.questionKey)

    if (error) {
        return res.status(400).json({
            error: 'Wrong parameters',
            details: error.toString(),
        })
    }

    const { error: dbError, status, data } = await deleteUnrevealedQuestion(req.query.questionKey as string)

    if (dbError) {
        return res.status(status).json({
            error: "Can't delete UnrevealedQuestion",
            details: dbError.message,
        })
    }

    res.status(status).json(data)
}

export default async function unrevealedQuestions(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method === 'GET') await get(req, res)
        else if (req.method === 'POST') await post(req, res)
        else if (req.method === 'DELETE') await del(req, res)
        else res.status(404).json({ error: 'Method not found' })
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong',
            details: String(error),
        })
    }
}
