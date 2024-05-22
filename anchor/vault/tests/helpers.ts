import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

const VAULT_SEED = "VAULT_SEED";

export function getVaultAddress(
  vault_authority: PublicKey,
  programID: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode(VAULT_SEED), vault_authority.toBuffer()],
    programID
  );
}

export async function airdrop(
  connection: any,
  address: any,
  amount = 1000000000
) {
  await connection.confirmTransaction(
    await connection.requestAirdrop(address, amount),
    "confirmed"
  );
}
