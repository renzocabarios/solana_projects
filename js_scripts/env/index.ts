import { Commitment, clusterApiUrl } from "@solana/web3.js";
import "dotenv/config";

export const RPC_URL: string = process.env.RPC_URL ?? clusterApiUrl("devnet");
export const PAYER_PRIVATE_KEY: string =
  process.env.PAYER_PRIVATE_KEY ?? "secret";
export const CONNECTION_COMMITMENT: Commitment =
  (process.env.CONNECTION_COMMITMENT as Commitment) ?? "finalized";
