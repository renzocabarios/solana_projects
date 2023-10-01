import { PublicKey } from "@solana/web3.js";
import { idl } from "./idl";
import { AnchorProvider, Program } from "@coral-xyz/anchor";

const PROGRAM_ID = new PublicKey(idl.metadata.address);

function getProgramInstance(provider: AnchorProvider) {
  return new Program(JSON.parse(JSON.stringify(idl)), PROGRAM_ID, provider);
}

export { PROGRAM_ID, getProgramInstance };
