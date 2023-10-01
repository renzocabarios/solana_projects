import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnoniDapp } from "../target/types/anoni_dapp";
import { assert } from "chai";

describe("anoni_dapp", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const post = anchor.web3.Keypair.generate();
  const program = anchor.workspace.AnoniDapp as Program<AnoniDapp>;

  it("Create calculator", async () => {
    const title: string = "Welcome to Solana";
    const content: string = "content";

    await program.methods
      .createPost(title, content)
      .accounts({
        post: post.publicKey,
        signer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([post])
      .rpc();

    const account = await program.account.post.fetch(post.publicKey);
    assert.ok(account.content === content);
    assert.ok(account.title === title);
    assert.ok(
      account.creator.toString() === provider.wallet.publicKey.toString()
    );
  });
});
