import { Program, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export async function createPost(
  program: Program<any>,
  signer: PublicKey,
  payload: any,
): Promise<void> {
  const keypair = web3.Keypair.generate();
  try {
    await program.methods
      .createPost(payload.title, payload.content)
      .accounts({
        post: keypair.publicKey,
        signer,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();
  } catch (_) {
    alert(_);
  }
}
