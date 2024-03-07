import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { CONNECTION } from "../config";

export async function getAccountBalance(publicKey: PublicKey): Promise<number> {
  const walletBalance = await CONNECTION.getBalance(publicKey);

  return walletBalance / LAMPORTS_PER_SOL;
}
