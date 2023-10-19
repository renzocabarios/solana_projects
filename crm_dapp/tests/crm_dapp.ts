import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CrmDapp } from "../target/types/crm_dapp";
import { assert } from "chai";

describe("crm_dapp", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const program = anchor.workspace.CrmDapp as Program<CrmDapp>;
  const keyPair = anchor.web3.Keypair.generate();

  it("Should create customer", async () => {
    const firstName: string = "Sample";
    const lastName: string = "Sample";
    const email: string = "sample@gmail.com";

    await program.methods
      .createCustomer(firstName, lastName, email)
      .accounts({
        customer: keyPair.publicKey,
        signer: provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([keyPair])
      .rpc();

    const customer = await program.account.customer.fetch(keyPair.publicKey);
    assert.ok(customer.firstName === firstName);
    assert.ok(customer.lastName === lastName);
    assert.ok(customer.email === email);
  });

  it("Should update customer", async () => {
    const firstName: string = "new";
    const lastName: string = "new";
    const email: string = "new@gmail.com";

    await program.methods
      .updateCustomer(firstName, lastName, email)
      .accounts({
        customer: keyPair.publicKey,
      })
      .rpc();

    const customer = await program.account.customer.fetch(keyPair.publicKey);
    assert.ok(customer.firstName === firstName);
    assert.ok(customer.lastName === lastName);
    assert.ok(customer.email === email);
  });

  it("Should update customer", async () => {
    const deleted: boolean = true;

    await program.methods
      .deleteCustomer()
      .accounts({
        customer: keyPair.publicKey,
      })
      .rpc();

    const customer = await program.account.customer.fetch(keyPair.publicKey);
    assert.ok(customer.deleted === deleted);
  });
});
