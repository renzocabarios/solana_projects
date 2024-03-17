import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Project02 } from "../target/types/project_02";

describe("project_02", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Project02 as Program<Project02>;

  it("Is initialized!", async () => {
    const [counterPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("counter")],
      program.programId
    );
    // Add your test here.
    const tx = await program.methods
      .initialize()
      .accounts({
        payer: provider.publicKey,
        counter: counterPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
