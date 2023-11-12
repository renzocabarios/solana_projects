import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ExpressStringSaver } from "../target/types/express_string_saver";

describe("express_string_saver", () => {
  anchor.setProvider(anchor.AnchorProvider.local());
  const provider = anchor.getProvider();
  const program = anchor.workspace
    .ExpressStringSaver as Program<ExpressStringSaver>;

  const holder = anchor.web3.Keypair.generate();
  it("Is initialized!", async () => {
    await program.methods
      .initialize()
      .accounts({
        stringHolder: holder.publicKey,
        signer: provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([holder])
      .rpc();

    const account = await program.account.stringHolder.fetch(holder.publicKey);
    console.log("My account", account);
  });

  it("Is updated!", async () => {
    const data: string = "Hello World";
    await program.methods
      .update(data)
      .accounts({
        stringHolder: holder.publicKey,
      })
      .rpc();

    const account = await program.account.stringHolder.fetch(holder.publicKey);
    console.log("My Account", account);
  });
});
