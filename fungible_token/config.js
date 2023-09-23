import * as Web3 from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from "dotenv";
dotenv.config();

export const ACCOUNT = Web3.Keypair.fromSecretKey(
  bs58.decode(process.env.PRIVATE_KEY)
);

export const CLUSTER = Web3.clusterApiUrl("devnet");
export const COMMITMENT = "confirmed";

export const CONNECTION = new Web3.Connection(CLUSTER, COMMITMENT);
