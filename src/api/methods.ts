import { Replay } from '../types'
import { api } from './api'

interface MessageToSignParams {
    publicKey: string
    nonce: string
    issuedAt: string
}

export function getMessageToSign({ publicKey, nonce, issuedAt }: MessageToSignParams) {
    return api
        .get<string>('account/messageToSign', {
            params: {
                public_key_base58: publicKey,
                nonce,
                issued_at_string: issuedAt,
            },
        })
        .then((res) => res.data)
        .catch(() => null)
}

interface TokenParams extends MessageToSignParams {
    signature: string
}

export function createToken({ publicKey, nonce, issuedAt, signature }: TokenParams) {
    return api
        .post<{ token: string }>('account/token', null, {
            params: {
                public_key_base58: publicKey,
                nonce,
                issued_at_string: issuedAt,
                signature_base58: signature,
            },
        })
        .then((res) => res.data.token)
        .catch(() => null)
}

export function getReplay() {
    return api
        .get<Replay>('replays/last')
        .then((res) => res.data)
        .catch(() => null)
}
