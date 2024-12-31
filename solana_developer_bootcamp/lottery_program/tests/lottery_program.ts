import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { LotteryProgram } from "../target/types/lottery_program";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

describe("lottery_program", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
  const program = anchor.workspace.LotteryProgram as Program<LotteryProgram>;

  // it("Is initialized config", async () => {
  //   const tx = await program.methods
  //     .initializeConfig(new anchor.BN(1), new anchor.BN(1), new anchor.BN(1))
  //     .rpc();
  //   console.log("Your transaction signature", tx);
  // });

  // it("Is initialized lottery", async () => {
  //   const mint = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("collection_mint")],
  //     program.programId
  //   )[0];

  //   const metadata = anchor.web3.PublicKey.findProgramAddressSync(
  //     [
  //       Buffer.from("metadata"),
  //       TOKEN_METADATA_PROGRAM_ID.toBuffer(),
  //       mint.toBuffer(),
  //     ],
  //     TOKEN_METADATA_PROGRAM_ID
  //   )[0];

  //   const masterEdition = anchor.web3.PublicKey.findProgramAddressSync(
  //     [
  //       Buffer.from("metadata"),
  //       TOKEN_METADATA_PROGRAM_ID.toBuffer(),
  //       mint.toBuffer(),
  //       Buffer.from("edition"),
  //     ],
  //     TOKEN_METADATA_PROGRAM_ID
  //   )[0];

  //   const tx = await program.methods
  //     .initializeLottery()
  //     .accounts({
  //       masterEdition: masterEdition,
  //       metadata: metadata,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //     })
  //     .rpc();
  //   console.log("Your transaction signature", tx);
  // });

  it("should buy ticket", async () => {
    await program.methods
      .initializeConfig(
        new anchor.BN(0),
        new anchor.BN(1),
        new anchor.BN(10000)
      )
      .rpc({ commitment: "confirmed" });

    const mint = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("collection_mint")],
      program.programId
    )[0];

    const metadata = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )[0];

    const masterEdition = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )[0];

    await program.methods
      .initializeLottery()
      .accounts({
        masterEdition: masterEdition,
        metadata: metadata,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: "finalized" });

    const tx = await program.methods
      .buyTicket()
      .accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });
    console.log("Your transaction signature", tx);
  });
});
