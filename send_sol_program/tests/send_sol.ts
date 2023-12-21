import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SendSol } from "../target/types/send_sol";
import { assert } from "chai";

describe("send_sol", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SendSol as Program<SendSol>;

  const provider = anchor.getProvider();
  const connection = provider.connection;

  const airdropTo = async (to: anchor.web3.PublicKey) => {
    const tx = await connection.requestAirdrop(
      to,
      anchor.web3.LAMPORTS_PER_SOL * 10
    );
    await provider.connection.confirmTransaction(tx);
  };

  it("Is initialized!", async () => {
    const amount = 1;
    const from = anchor.web3.Keypair.generate();
    const to = anchor.web3.Keypair.generate();
    await airdropTo(from.publicKey);
    await airdropTo(to.publicKey);
    const before = await connection.getBalance(to.publicKey);
    const tx = await program.methods
      .initialize(new anchor.BN(anchor.web3.LAMPORTS_PER_SOL * amount))
      .accounts({
        signer: from.publicKey,
        to: to.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([from])
      .rpc();

    await provider.connection.confirmTransaction(tx);
    const after = await connection.getBalance(to.publicKey);
    assert.equal(after - before, anchor.web3.LAMPORTS_PER_SOL * amount);
  });
});
