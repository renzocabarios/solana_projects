import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MoneyTransfer } from "../target/types/money_transfer";
import { assert } from "chai";

describe("money_transfer", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.MoneyTransfer as Program<MoneyTransfer>;
  const connection = provider.connection;
  const amount = anchor.web3.LAMPORTS_PER_SOL * 10;
  const to = anchor.web3.Keypair.generate();

  const airdrop = async (account: anchor.web3.PublicKey): Promise<void> => {
    await connection
      .requestAirdrop(account, anchor.web3.LAMPORTS_PER_SOL * 10)
      .then(confirm);
  };

  const getBalance = async (
    account: anchor.web3.PublicKey
  ): Promise<number> => {
    return await connection.getBalance(account);
  };

  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({ signature, ...block });
    return signature;
  };

  it("sent money", async () => {
    await airdrop(provider.publicKey);
    const tx = await program.methods
      .sendMoney(new anchor.BN(amount))
      .accounts({
        to: to.publicKey,
        from: provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()
      .then(confirm);

    assert.equal(amount, await getBalance(to.publicKey));
  });
});
