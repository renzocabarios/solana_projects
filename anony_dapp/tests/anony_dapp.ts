import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnonyDapp } from "../target/types/anony_dapp";
import { PublicKey } from "@solana/web3.js";
import { assert } from "chai";

describe("anony_dapp", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.AnonyDapp as Program<AnonyDapp>;

  it("Is should create post", async () => {
    const title: string = "Title Test";
    const content: string = "Content Test";
    const creator: anchor.web3.PublicKey = provider.publicKey;
    const [postPDA, _] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("post"),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .createPost("Title Test", "Content Test")
      .accounts({
        post: postPDA,
        signer: provider.publicKey,
      })
      .rpc();

    const post = await program.account.post.fetch(postPDA);

    assert.ok(post.creator.toString() === creator.toString());
    assert.ok(post.title === title);
    assert.ok(post.content === content);
  });
});
