import * as solana from '@solana/web3.js'

const address = 'ANJEwjiYZTmsMkXfgvFGPcEEQ52sXgehC7oBWzJxtFUZ'

export const programID = new solana.PublicKey(address)
export const preflightCommitment = 'processed'

export const clusters: solana.Cluster[] = ['mainnet-beta', 'testnet', 'devnet']
export function clusterUrl(cluster: solana.Cluster) {
    return solana.clusterApiUrl(cluster)
}
