import { BN } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  createATA,
  createMint,
  getAssociatedTokenAccountPda,
  getBankAccountPda,
  getTreasuryAccountPda,
  getUserAccountPda,
  mintTo,
} from "./utils";
import { startEnv } from "./setups";

describe("lending program", () => {
  test("Test init user", async () => {
    const { user, usdc } = await startEnv();
    await user.program.methods.initUser(usdc.publicKey).rpc();
  });

  test("Test init bank", async () => {
    const { admin, client, usdc } = await startEnv();

    const treasuryAccountPDA = getTreasuryAccountPda(
      usdc.publicKey,
      admin.program.programId
    );

    await admin.program.methods
      .initBank(new BN(1), new BN(1))
      .accounts({
        mint: usdc.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    const amount = 10_000 * 10 ** 6;
    await mintTo(
      client,
      admin.account,
      usdc.publicKey,
      treasuryAccountPDA,
      admin.account.publicKey,
      amount
    );
  });

  test("Deposit", async () => {
    const { user, client, usdc, admin } = await startEnv();
    await user.program.methods.initUser(usdc.publicKey).rpc();

    const treasuryAccountPDA = getTreasuryAccountPda(
      usdc.publicKey,
      admin.program.programId
    );
    const bankAccountPDA = getBankAccountPda(
      usdc.publicKey,
      admin.program.programId
    );

    const userAccountPDA = getUserAccountPda(
      user.account.publicKey,
      admin.program.programId
    );

    await admin.program.methods
      .initBank(new BN(1), new BN(1))
      .accounts({
        mint: usdc.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    const amount = 10_000 * 10 ** 6;
    const mintTx = await mintTo(
      client,
      admin.account,
      usdc.publicKey,
      treasuryAccountPDA,
      admin.account.publicKey,
      amount
    );

    const userAssociatedTokenAccountPDA = getAssociatedTokenAccountPda(
      user.account.publicKey,
      usdc.publicKey
    );

    await createATA(
      client,
      user.account,
      userAssociatedTokenAccountPDA,
      user.account.publicKey,
      usdc.publicKey,
      user.account
    );

    await mintTo(
      client,
      admin.account,
      usdc.publicKey,
      userAssociatedTokenAccountPDA,
      admin.account.publicKey,
      amount
    );

    await user.program.methods
      .deposit(new BN(1 * 10 ** 6))
      .accountsPartial({
        mint: usdc.publicKey,
        bank: bankAccountPDA,
        bankTokenAccount: treasuryAccountPDA,
        userAccount: userAccountPDA,
        userTokenAccount: userAssociatedTokenAccountPDA,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log(await user.program.account.bank.fetch(bankAccountPDA));
    console.log(await user.program.account.user.fetch(userAccountPDA));
  });
});
