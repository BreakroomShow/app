import { getPhantomWallet } from '@solana/wallet-adapter-wallets'
import * as solana from '@solana/web3.js'
import * as trivia from 'clic-trivia'

const address = 'ANJEwjiYZTmsMkXfgvFGPcEEQ52sXgehC7oBWzJxtFUZ'

export const triviaIdl = trivia.idl as trivia.TriviaIdl
export const preflightCommitment = 'processed'
export const programID = new solana.PublicKey(address)
export const wallets = [getPhantomWallet()]

export type Cluster = solana.Cluster

export const clusters: solana.Cluster[] = ['mainnet-beta', 'testnet', 'devnet']
export function clusterUrl(cluster: solana.Cluster) {
    return solana.clusterApiUrl(cluster)
}
