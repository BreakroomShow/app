import { PublicKey } from '@solana/web3.js'
import bs58 from 'bs58'
import axios from 'redaxios'

import { msToDateString } from '../utils/date'
import { createToken, getMessageToSign } from './methods'

export const api = axios.create({
    baseURL: 'https://backend.breakroom.show',
    transformRequest: [
        (_, headers) => {
            if (headers && headers.Authorization && !headers.Authorization.startsWith('Bearer')) {
                headers.Authorization = `Bearer ${headers.Authorization}`
            }
        },
    ],
}) as typeof axios

export async function authorize({
    publicKey,
    sign,
}: {
    publicKey?: PublicKey | null
    sign?(message: Uint8Array): Promise<Uint8Array>
}) {
    try {
        if (!publicKey) throw new Error(`Wallet is not connected`)

        const nonce = Date.now()

        const publicKeyString = publicKey.toString()
        const nonceString = nonce.toString()
        const issuedAtString = msToDateString(nonce)

        const message = await getMessageToSign({
            publicKey: publicKeyString,
            nonce: nonceString,
            issuedAt: issuedAtString,
        })

        if (!message) throw new Error(`Can't get message to sign`)
        if (!sign) throw new Error('Wallet does not support message signing!')

        const signature = await sign(new TextEncoder().encode(message))

        if (!signature) throw new Error(`Can't sign message`)

        const result = await createToken({
            publicKey: publicKeyString,
            nonce: nonceString,
            issuedAt: issuedAtString,
            signature: bs58.encode(signature),
        })

        if (!result) throw new Error(`Can't get token`)

        return result
    } catch (err) {
        console.error({ authorizeError: err })

        throw err
    }
}
