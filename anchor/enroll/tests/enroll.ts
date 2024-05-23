import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Enroll } from "../target/types/enroll";
import { assert } from "chai";

describe("enroll", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Enroll as Program<Enroll>;
  const discord = "@renzothenoob";
  const github = "@renzothenoob";

  it("Is initialized!", async () => {
    const [enrollment] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("enroll"), provider.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .initialize(discord, github)
      .accounts({
        payer: provider.publicKey,
        enrollment: enrollment,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Your transaction signature", tx);

    const accountData = await program.account.enrollment.fetch(enrollment);

    assert.equal(accountData.discord, discord);
    assert.equal(accountData.github, github);
  });
});
