import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PdaDemo } from "../target/types/pda_demo";
import { PublicKey } from "@solana/web3.js";
describe("pda_demo", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.PdaDemo as Program<PdaDemo>;

  it("Is initialized!", async () => {
    const [tweetPDA, _] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("tweet"),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .createTweet("testsets")
      .accounts({
        signer: provider.wallet.publicKey,
        tweet: tweetPDA,
      })
      .rpc();

    console.log(
      "Your transaction signature",
      await program.account.tweet.fetch(tweetPDA)
    );
  });
});
