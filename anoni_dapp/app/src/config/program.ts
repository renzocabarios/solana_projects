import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { IDL, idl } from "./idl";
import { AnoniDapp, IProgram } from "../interfaces";

const PROGRAM_ID: PublicKey = new PublicKey(idl.metadata.address);

function getProgramInstance(provider: AnchorProvider): IProgram {
  return new Program<AnoniDapp>(IDL, PROGRAM_ID, provider);
}

export { PROGRAM_ID, getProgramInstance };
