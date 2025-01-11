import { BN } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { createMint, getTreasuryAccountPda, mintTo } from "./utils";
import { startEnv } from "./setups";

describe("My test", () => {
  test("Test init user", async () => {
    const { user, client } = await startEnv();

    const usdc = Keypair.generate();

    await createMint(
      client,
      user.account,
      user.account.publicKey,
      null,
      6,
      usdc
    );

    await user.program.methods.initUser(usdc.publicKey).rpc();
  });

  test("Test init bank", async () => {
    const { user, client } = await startEnv();

    const usdc = Keypair.generate();

    await createMint(
      client,
      user.account,
      user.account.publicKey,
      null,
      6,
      usdc
    );

    const treasuryAccountPDA = getTreasuryAccountPda(
      usdc.publicKey,
      user.program.programId
    );
    await user.program.methods
      .initBank(new BN(1), new BN(1))
      .accounts({
        mint: usdc.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    const amount = 10_000 * 10 ** 9;
    const mintTx = await mintTo(
      client,
      user.account,
      usdc.publicKey,
      treasuryAccountPDA,
      user.account.publicKey,
      amount
    );
  });
});
