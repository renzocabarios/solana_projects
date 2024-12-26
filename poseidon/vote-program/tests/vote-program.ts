import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VoteProgram } from "../target/types/vote_program";
import { assert } from "chai";

describe("vote program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.VoteProgram as Program<VoteProgram>;
  const voteState = anchor.web3.PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("vote")],
    program.programId
  )[0];

  it("Create and initialize vote state", async () => {
    const txid = await program.methods
      .initialize()
      .accounts({
        user: provider.wallet.publicKey,
      })
      .rpc();
    console.log("Initialize tx:", txid);

    const voteStateAccount = await program.account.voteState.fetch(voteState);
    assert.ok(voteStateAccount.vote.eq(new anchor.BN(0)));
  });

  it("Upvote", async () => {
    const txid = await program.methods.upvote().accounts({}).rpc();

    console.log("upvote tx:", txid);

    const voteStateAccount = await program.account.voteState.fetch(voteState);
    assert.ok(voteStateAccount.vote.eq(new anchor.BN(1)));
  });

  it("Downvote", async () => {
    const txid = await program.methods.downvote().accounts({}).rpc();

    console.log("downvote tx:", txid);

    const voteStateAccount = await program.account.voteState.fetch(voteState);
    assert.ok(voteStateAccount.vote.eq(new anchor.BN(0)));
  });
});
