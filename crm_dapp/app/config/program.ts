import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { IDL } from "@/config/idl";
import { IProgram, CrmDapp } from "@/interfaces";

const PROGRAM: PublicKey = new PublicKey(
  "En6BofD5Pdmv3anMUKuL7zhbaYd7urCvkeqFa11Z9SFd"
);

function getProgramInstance(provider: AnchorProvider): IProgram {
  return new Program<CrmDapp>(IDL, PROGRAM, provider);
}

export { PROGRAM, getProgramInstance };
