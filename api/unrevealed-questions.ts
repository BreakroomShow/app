import { VercelRequest, VercelResponse } from '@vercel/node'
import * as joi from 'joi'

import * as db from './_db'

const GetUnrevealedQuestionParamsSchema = joi.array().required().items(joi.string())

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

    const result = await db.selectUnrevealedQuestions(questionKeys)

    res.status(200).json(result)
}

const PostUnrevealedQuestionParamsSchema = joi
    .object({
        publicKey: joi.string().required(),
        name: joi.string().required(),
        variants: joi.array().required().length(3).items(joi.string()),
    })
    .required()

async function post(req: VercelRequest, res: VercelResponse) {
    const { error } = PostUnrevealedQuestionParamsSchema.validate(req.body)

    if (error) {
        return res.status(400).json({
            error: 'Wrong parameters',
            details: error.toString(),
        })
    }

    const { error: dbError, status, data } = await db.insertUnrevealedQuestion(req.body)

    if (dbError) {
        return res.status(status).json({
            error: "Can't save UnrevealedQuestion",
            details: dbError.message,
        })
    }

    res.status(status).json(data)
}

async function del(req: VercelRequest, res: VercelResponse) {
    const { error } = joi.string().required().validate(req.query.questionKey)

    if (error) {
        return res.status(400).json({
            error: 'Wrong parameters',
            details: error.toString(),
        })
    }

    const { error: dbError, status, data } = await db.deleteUnrevealedQuestion(req.query.questionKey as string)

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
