import { VercelRequest, VercelResponse } from '@vercel/node'
import * as joi from 'joi'

import * as db from './_db'

async function get(req: VercelRequest, res: VercelResponse) {
    const result = await db.selectCurrentGameId()

    res.status(200).json({ gameId: result })
}

const PostNextGameParamsSchema = joi
    .object<{ gameId?: number }>({
        gameId: joi.number().optional().allow(null),
    })
    .required()

async function post(req: VercelRequest, res: VercelResponse) {
    const { error, value } = PostNextGameParamsSchema.validate(req.body)

    if (error) {
        return res.status(400).json({
            error: 'Wrong parameters',
            details: error.toString(),
        })
    }

    const { error: dbError, status, data } = await db.updateCurrentGameId(value?.gameId || null)

    if (dbError) {
        return res.status(status).json({
            error: "Can't update NextGame",
            details: dbError.message,
        })
    }

    res.status(status).json(data)
}

export default async function nextGame(req: VercelRequest, res: VercelResponse) {
    try {
        if (req.method === 'GET') await get(req, res)
        else if (req.method === 'POST') await post(req, res)
        else res.status(404).json({ error: 'Method not found' })
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong',
            details: String(error),
        })
    }
}
