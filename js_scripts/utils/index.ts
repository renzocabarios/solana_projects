import {
  BlockhashWithExpiryBlockHeight,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  RpcResponseAndContext,
  SignatureResult,
} from "@solana/web3.js";
import { CONNECTION } from "../config";

export function SOLtoLamports(value: number): number {
  return value * LAMPORTS_PER_SOL;
}

export function LamportstoSOL(value: number): number {
  return value / LAMPORTS_PER_SOL;
}

export async function getAccountBalance(publicKey: PublicKey): Promise<number> {
  const walletBalance = await CONNECTION.getBalance(publicKey);
  return walletBalance / LAMPORTS_PER_SOL;
}

export async function airdropTo(
  publicKey: PublicKey,
  sol: number
): Promise<string> {
  const airdropSignature = await requestAirdrop(publicKey, LamportstoSOL(sol));
  await confirmTransaction(airdropSignature);
  return airdropSignature;
}

export async function requestAirdrop(
  publicKey: PublicKey,
  lamports: number
): Promise<string> {
  return await CONNECTION.requestAirdrop(publicKey, lamports);
}

export async function confirmTransaction(
  signature: string
): Promise<RpcResponseAndContext<SignatureResult>> {
  const { blockhash, lastValidBlockHeight } = await getLatestBlockhash();
  return await CONNECTION.confirmTransaction({
    blockhash: blockhash,
    lastValidBlockHeight: lastValidBlockHeight,
    signature,
  });
}

export async function getLatestBlockhash(): Promise<BlockhashWithExpiryBlockHeight> {
  return await CONNECTION.getLatestBlockhash();
}

export function generateKeypair(): Keypair {
  return Keypair.generate();
}
