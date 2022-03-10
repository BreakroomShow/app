import * as solana from '@solana/web3.js'

const address = 'ANJEwjiYZTmsMkXfgvFGPcEEQ52sXgehC7oBWzJxtFUZ'

export const programID = new solana.PublicKey(address)
export const preflightCommitment = 'processed'

export const clusters: solana.Cluster[] = ['mainnet-beta', 'testnet', 'devnet']
export function clusterUrl(cluster: solana.Cluster) {
    return solana.clusterApiUrl(cluster)
}

export const pusherNotificationInstanceId = '47ddd9b2-42d5-445d-8202-91ac0d80009f'

export const amplitudeApiKey = 'ddf04d6d4cc86bc0b1c60d39157721ea'
