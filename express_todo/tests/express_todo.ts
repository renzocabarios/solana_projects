import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ExpressTodo } from "../target/types/express_todo";
import { assert } from "chai";

describe("express_todo", () => {
  // Configure the client to use the local cluster.

  const program = anchor.workspace.ExpressTodo as Program<ExpressTodo>;
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();

  const keyPair = anchor.web3.Keypair.generate();
  it("Is initialized!", async () => {
    const name: string = "John DOe";
    const email: string = "sample@gmail.com";

    await program.methods
      .initialize(name, email)
      .accounts({
        customer: keyPair.publicKey,
        signer: provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([keyPair])
      .rpc();

    const account = await program.account.customer.fetch(keyPair.publicKey);
    assert.ok(account.name === name);
    assert.ok(account.email === email);
    assert.ok(account.deleted === false);
  });

  it("Should update", async () => {
    const name: string = "New Doe";
    const email: string = "doe@gmail.com";

    await program.methods
      .update(name, email)
      .accounts({
        customer: keyPair.publicKey,
      })
      .rpc();

    const account = await program.account.customer.fetch(keyPair.publicKey);
    assert.ok(account.name === name);
    assert.ok(account.email === email);
    assert.ok(account.deleted === false);
  });

  it("Should delete", async () => {
    await program.methods
      .delete()
      .accounts({
        customer: keyPair.publicKey,
      })
      .rpc();

    const account = await program.account.customer.fetch(keyPair.publicKey);
    assert.ok(account.deleted === true);
  });
});
