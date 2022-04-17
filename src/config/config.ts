import * as solana from '@solana/web3.js'

const address = 'Eb7ZLJqhTDmLDcoGbKUy6DKxSBraNEsfbDST4FWiXAwv'

export const programID = new solana.PublicKey(address)
export const preflightCommitment = 'processed'

export const devnetRpcEndpoint =
    'https://wispy-summer-river.solana-devnet.quiknode.pro/a4030f5defc3f7b7306d2460e35578282d1fe8b8'
export const devnetRpcWsEndpoint =
    'wss://wispy-summer-river.solana-devnet.quiknode.pro/a4030f5defc3f7b7306d2460e35578282d1fe8b8'

export const clusters: solana.Cluster[] = ['mainnet-beta', 'testnet', 'devnet']

export function clusterApi(cluster: solana.Cluster) {
    if (cluster === 'devnet') {
        return { endpoint: devnetRpcEndpoint, wsEndpoint: devnetRpcWsEndpoint }
    }

    return { endpoint: solana.clusterApiUrl(cluster) }
}

export const pusherNotificationInstanceId = '47ddd9b2-42d5-445d-8202-91ac0d80009f'
export const pusherAppKey = 'c105b584683024da7862'
export const pusherCluster = 'mt1'

export const amplitudeApiKey = 'ddf04d6d4cc86bc0b1c60d39157721ea'

export const totalQuestions = 12
