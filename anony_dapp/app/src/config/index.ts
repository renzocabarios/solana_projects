import { clusterApiUrl, Connection } from "@solana/web3.js";
import { PROGRAM_ID, getProgramInstance } from "./program";
import { idl } from "./idl";

export const CONNECTION = new Connection(clusterApiUrl("devnet"), "processed");
export const OPTIONS = { commitment: "processed" };

export { getProgramInstance, PROGRAM_ID, idl };
