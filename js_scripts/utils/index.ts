import {
  BlockhashWithExpiryBlockHeight,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  RpcResponseAndContext,
  SignatureResult,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { CONNECTION } from "../config";
import bs58 from "bs58";
import { PAYER_PRIVATE_KEY } from "../env";

export function systemProgramTransferInstruction(
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  sol: number
): TransactionInstruction {
  return SystemProgram.transfer({
    fromPubkey,
    toPubkey,
    lamports: SOLtoLamports(sol),
  });
}

export async function transferSOL(
  to: PublicKey,
  sol: number
): Promise<TransactionSignature> {
  const payerKeypair = getPayerKeypair();
  const transaction = new Transaction().add(
    systemProgramTransferInstruction(payerKeypair.publicKey, to, sol)
  );

  const estimatedFee = await getEstimatedFee(
    transaction,
    payerKeypair.publicKey
  );
  console.log("Estimated SOL Fee", estimatedFee);

  return await sendAndConfirmTransaction(CONNECTION, transaction, [
    payerKeypair,
  ]);
}

export function getPayerKeypair(): Keypair {
  return Keypair.fromSecretKey(bs58.decode(PAYER_PRIVATE_KEY));
}

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

export async function getEstimatedFee(
  transaction: Transaction,
  feepayer: PublicKey
): Promise<number | null> {
  const { blockhash, lastValidBlockHeight } = await getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = feepayer;
  return LamportstoSOL(
    Number((await transaction.getEstimatedFee(CONNECTION)) ?? 0)
  );
}
