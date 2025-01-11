import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { LendingProgram } from "../target/types/lending_program";
import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { Keypair } from "@solana/web3.js";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { createMint, getUserAccountPda } from "./utils";

const IDL = require("../target/idl/lending_program.json");

export async function startEnv() {
  const user = Keypair.generate();

  const context = await startAnchor(
    ".",
    [],
    [
      {
        address: user.publicKey,
        info: {
          lamports: 10_000_000_000,
          data: Buffer.alloc(0),
          owner: SYSTEM_PROGRAM_ID,
          executable: false,
        },
      },
    ]
  );

  const client = context.banksClient;

  const provider = new BankrunProvider(context);
  provider.wallet = new NodeWallet(user);
  const program = new Program<LendingProgram>(IDL, provider);

  return {
    client,
    user: {
      provider,
      program,
      account: user,
    },
  };
}

describe("My test", () => {
  test("Test init user", async () => {
    const user = Keypair.generate();

    const context = await startAnchor(
      ".",
      [],
      [
        {
          address: user.publicKey,
          info: {
            lamports: 10_000_000_000,
            data: Buffer.alloc(0),
            owner: SYSTEM_PROGRAM_ID,
            executable: false,
          },
        },
      ]
    );
    const client = context.banksClient;

    const provider = new BankrunProvider(context);
    provider.wallet = new NodeWallet(user);
    const program = new Program<LendingProgram>(IDL, provider);

    anchor.setProvider(provider);
    const usdc = Keypair.generate();

    await createMint(client, user, user.publicKey, null, 6, usdc);

    const userPDA = getUserAccountPda(user.publicKey, program.programId);

    await program.methods
      .initUser(usdc.publicKey)
      .accounts({})
      .signers([])
      .rpc();

    console.log(await program.account.user.fetch(userPDA));
  });
});
