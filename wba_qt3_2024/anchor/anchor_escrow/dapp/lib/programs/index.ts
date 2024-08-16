import { BN, Program } from "@coral-xyz/anchor";
import { EscrowProgramIDL } from "./idl";
import { PublicKey } from "@solana/web3.js";
import { randomBytes } from "crypto";

interface IGetEscrowAccountArgs {
  maker: PublicKey;
  seed: BN;
}

export function getEscrowPDA({ maker, seed }: IGetEscrowAccountArgs) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("escrow"),
      maker.toBuffer(),
      seed.toArrayLike(Buffer, "le", 8),
    ],
    new PublicKey(EscrowProgramIDL.address)
  )[0];
}

export function generateRandomSeed() {
  return new BN(randomBytes(8));
}
