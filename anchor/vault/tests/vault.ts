import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Vault } from "../target/types/vault";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { airdrop, getVaultAddress } from "./helpers";
import { assert } from "chai";

describe("vault", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local("http://127.0.0.1:8899");
  anchor.setProvider(provider);

  const program = anchor.workspace.Vault as Program<Vault>;
  const wallet_1: Keypair = Keypair.generate();
  const amountDeposit: number = 10;
  const amountWithdraw: number = 9;

  it("Is initialized!", async () => {
    await airdrop(provider.connection, wallet_1.publicKey);
    const [vaultKey, vaultBump] = getVaultAddress(
      wallet_1.publicKey,
      program.programId
    );
    const tx = await program.methods
      .initialize()
      .accounts({
        systemProgram: SystemProgram.programId,
        vaultAuthority: wallet_1.publicKey,
        vaultAccount: vaultKey,
      })
      .signers([wallet_1])
      .rpc();

    const vaultAccount = await program.account.vaultAccount.fetch(vaultKey);

    assert.equal(
      vaultAccount.vaultAuthority.toString(),
      wallet_1.publicKey.toString()
    );
  });

  it("Is will deposit!", async () => {
    const [vaultKey, vaultBump] = getVaultAddress(
      wallet_1.publicKey,
      program.programId
    );

    await program.methods
      .deposit(new anchor.BN(amountDeposit))
      .accounts({
        systemProgram: SystemProgram.programId,
        vaultAuthority: wallet_1.publicKey,
        vaultAccount: vaultKey,
      })
      .signers([wallet_1])
      .rpc();

    const vaultAccount = await program.account.vaultAccount.fetch(vaultKey);
    assert.equal(Number(vaultAccount.amount), amountDeposit);
  });

  it("Is will withdraw!", async () => {
    const [vaultKey, vaultBump] = getVaultAddress(
      wallet_1.publicKey,
      program.programId
    );

    const currentAmount: number = amountDeposit - amountWithdraw;

    await program.methods
      .withdraw(new anchor.BN(amountWithdraw))
      .accounts({
        vaultAuthority: wallet_1.publicKey,
        vaultAccount: vaultKey,
      })
      .signers([wallet_1])
      .rpc();

    const vaultAccount = await program.account.vaultAccount.fetch(vaultKey);
    assert.equal(Number(vaultAccount.amount), currentAmount);
  });
});
