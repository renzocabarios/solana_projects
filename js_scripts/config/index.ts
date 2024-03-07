import { Connection } from "@solana/web3.js";
import { CONNECTION_COMMITMENT, RPC_URL } from "../env";

export const CONNECTION = new Connection(RPC_URL, CONNECTION_COMMITMENT);
