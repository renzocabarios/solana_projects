import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Vault } from "../target/types/vault";
import { assert } from "chai";

describe("vault", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Vault as Program<Vault>;
  const connection = provider.connection;

  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({ signature, ...block });
    return signature;
  };

  const amount = anchor.web3.LAMPORTS_PER_SOL * 10;

  const vault = [Buffer.from("vault"), provider.publicKey.toBuffer()];
  const [vaultKey, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    vault,
    program.programId
  );

  it("initialized vault account", async () => {
    await program.methods
      .initialize()
      .accounts({
        payer: provider.publicKey,
        depositAccount: vaultKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()
      .then(confirm);

    assert.isNotNull(await program.account.depositAccount.fetch(vaultKey));
  });

  it("Is deposited!", async () => {
    const tx = await program.methods
      .deposit(new anchor.BN(amount))
      .accounts({
        payer: provider.publicKey,
        depositAccount: vaultKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()
      .then(confirm);

    const account = await program.account.depositAccount.fetch(vaultKey);
    assert.equal(Number(account.totalDeposits), amount);
  });

  it("Is withdrawed!", async () => {
    const tx = await program.methods
      .withdraw(new anchor.BN(amount))
      .accounts({
        user: provider.publicKey,
        depositAccount: vaultKey,
      })
      .rpc()
      .then(confirm);

    const account = await program.account.depositAccount.fetch(vaultKey);
    assert.equal(Number(account.totalDeposits), amount - amount);
  });
});
