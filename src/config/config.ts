import { getPhantomWallet } from '@solana/wallet-adapter-wallets'
import * as solana from '@solana/web3.js'
import { TriviaIdl, idl } from 'clic-trivia'

export const triviaIdl = idl as unknown as TriviaIdl
export const preflightCommitment = 'processed'
export const programID = new solana.PublicKey(idl.metadata.address)
export const wallets = [getPhantomWallet()]

export type Cluster = solana.Cluster

export const clusters: solana.Cluster[] = ['mainnet-beta', 'testnet', 'devnet']
export function clusterUrl(cluster: solana.Cluster) {
    return solana.clusterApiUrl(cluster)
}
