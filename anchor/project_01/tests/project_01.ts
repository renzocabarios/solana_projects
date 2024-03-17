import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Project01 } from "../target/types/project_01";

describe("project_01", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Project01 as Program<Project01>;

  it("Is initialized!", async () => {
    const counterAccount = anchor.web3.Keypair.generate();
    // Add your test here.

    const tx = await program.methods
      .initialize()
      .accounts({
        payer: provider.publicKey,
        counter: counterAccount.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([counterAccount])
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
