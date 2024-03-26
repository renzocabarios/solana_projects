import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Enroll } from "../target/types/enroll";

describe("enroll", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Enroll as Program<Enroll>;

  it("Is initialized!", async () => {
    const [enrollment] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("enroll")],
      program.programId
    );

    const tx = await program.methods
      .initialize("@renzothenoob", "@renzothenoob")
      .accounts({
        payer: provider.publicKey,
        enrollment: enrollment,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Your transaction signature", tx);

    const accountData = await program.account.enrollment.fetch(enrollment);
    console.log("Bump", accountData.bump);
    console.log("Bump", accountData.discord);
    console.log("Bump", accountData.github);
  });
});
