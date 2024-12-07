import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VotingProgram } from "../target/types/voting_program";
import { PublicKey } from "@solana/web3.js";

describe("voting_program", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.VotingProgram as Program<VotingProgram>;

  it("initializePoll", async () => {
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const tx = await program.methods
      .initializePoll(
        new anchor.BN(1),
        new anchor.BN(0),
        new anchor.BN(1759508293),
        "test-poll",
        "description"
      )
      .rpc();

    console.log("Your transaction signature", tx);
  });

  it("initialize candidates", async () => {
    const pollIdBuffer = new anchor.BN(1).toArrayLike(Buffer, "le", 8);

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), pollIdBuffer],
      program.programId
    );

    const smoothTx = await program.methods
      .initializeCandidate(new anchor.BN(1), "smooth")
      .accounts({
        pollAccount: pollAddress,
      })
      .rpc();

    const crunchyTx = await program.methods
      .initializeCandidate(new anchor.BN(1), "crunchy")
      .accounts({
        pollAccount: pollAddress,
      })
      .rpc();

    console.log("Your transaction signature", smoothTx);
  });

  it("vote", async () => {
    const tx = await program.methods.vote(new anchor.BN(1), "smooth").rpc();

    console.log("Your transaction signature", tx);
  });
});
