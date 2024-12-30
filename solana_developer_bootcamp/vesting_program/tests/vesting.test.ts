import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { expect } from "@jest/globals";
import { createMint, envSetup, mintTo } from "./helpers";
import {
  createInitializeMint2Instruction,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";
import { Clock } from "solana-bankrun";

describe("vesting_program", () => {
  test("Create Mint ", async () => {
    const { banksClient, employer } = await envSetup();

    const mint = Keypair.generate();

    let rent = await banksClient.getRent();

    const tx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: employer.publicKey,
        newAccountPubkey: mint.publicKey,
        space: MINT_SIZE,
        lamports: Number(await rent.minimumBalance(BigInt(MINT_SIZE))),
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(
        mint.publicKey,
        2,
        employer.publicKey,
        employer.publicKey,
        TOKEN_PROGRAM_ID
      )
    );
    [tx.recentBlockhash] = (await banksClient.getLatestBlockhash())!;
    tx.sign(employer, mint);

    await banksClient.processTransaction(tx);
  });

  test("Initialize", async () => {
    const { employerProvidedProgram, banksClient, employer } = await envSetup();

    const mint = Keypair.generate();

    await createMint({
      banksClient,
      payer: employer,
      mint,
      decimals: 2,
      tokenProgram: TOKEN_PROGRAM_ID,
    });

    const companyName = "new_company";

    const tx = await employerProvidedProgram.methods
      .createVestingAccount(companyName)
      .accounts({
        signer: employer.publicKey,
        mint: mint.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([employer])
      .rpc({ commitment: "finalized" });

    expect(tx).toBeDefined();

    const [vestingAccountKey] = PublicKey.findProgramAddressSync(
      [Buffer.from(companyName)],
      employerProvidedProgram.programId
    );

    const vestingAccountData =
      await employerProvidedProgram.account.vestingAccount.fetch(
        vestingAccountKey,
        "finalized"
      );

    expect(vestingAccountData.companyName).toBe(companyName);
    expect(vestingAccountData.mint).toStrictEqual(mint.publicKey);
    expect(vestingAccountData.owner).toStrictEqual(employer.publicKey);
  });

  test("Add Funds", async () => {
    const { employerProvidedProgram, banksClient, employer } = await envSetup();

    const mint = Keypair.generate();

    await createMint({
      banksClient,
      payer: employer,
      mint,
      decimals: 2,
      tokenProgram: TOKEN_PROGRAM_ID,
    });

    const companyName = "new_company";

    await employerProvidedProgram.methods
      .createVestingAccount(companyName)
      .accounts({
        signer: employer.publicKey,
        mint: mint.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([employer])
      .rpc({ commitment: "finalized" });

    const [vestingAccountKey] = PublicKey.findProgramAddressSync(
      [Buffer.from(companyName)],
      employerProvidedProgram.programId
    );

    const vestingAccountData =
      await employerProvidedProgram.account.vestingAccount.fetch(
        vestingAccountKey,
        "finalized"
      );

    expect(vestingAccountData.companyName).toBe(companyName);
    expect(vestingAccountData.mint).toStrictEqual(mint.publicKey);
    expect(vestingAccountData.owner).toStrictEqual(employer.publicKey);

    const [treasuryTokenAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("vesting_treasury"), Buffer.from(companyName)],
      employerProvidedProgram.programId
    );
    const amount = 10_000 * 10 ** 2;
    await mintTo({
      banksClient,
      payer: employer,
      mint: mint.publicKey,
      destination: treasuryTokenAccount,
      amount,
    });
  });

  it("should create an employee vesting account", async () => {
    const {
      program,
      banksClient,
      employer,
      beneficiary,
      employerProvidedProgram,
    } = await envSetup();

    const mint = Keypair.generate();

    await createMint({
      banksClient,
      payer: employer,
      mint,
      decimals: 2,
      tokenProgram: TOKEN_PROGRAM_ID,
    });

    const companyName = "new_company";

    await employerProvidedProgram.methods
      .createVestingAccount(companyName)
      .accounts({
        signer: employer.publicKey,
        mint: mint.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([employer])
      .rpc({ commitment: "finalized" });

    const [vestingAccountKey] = PublicKey.findProgramAddressSync(
      [Buffer.from(companyName)],
      program.programId
    );

    const amount = 10_000 * 10 ** 2;

    const [treasuryTokenAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("vesting_treasury"), Buffer.from(companyName)],
      program.programId
    );

    await mintTo({
      banksClient,
      payer: employer,
      mint: mint.publicKey,
      destination: treasuryTokenAccount,
      amount,
    });
    const vestingAccountData = await program.account.vestingAccount.fetch(
      vestingAccountKey,
      "finalized"
    );

    console.log(vestingAccountData);

    const tx2 = await employerProvidedProgram.methods
      .createEmployeeVesting(new BN(0), new BN(100), new BN(0), new BN(0))
      .accounts({
        beneficiary: beneficiary.publicKey,
        vestingAccount: vestingAccountKey,
      })
      .rpc({ commitment: "finalized", skipPreflight: true });

    console.log("Create Employee Account Transaction Signature:", tx2);
    // console.log("Employee account", employeeAccount.toBase58());
  });

  it("should claim tokens", async () => {
    const {
      program,
      banksClient,
      employer,
      beneficiary,
      employerProvidedProgram,
      beneficiaryProvidedProgram,
      context,
    } = await envSetup();
    const mint = Keypair.generate();

    await createMint({
      banksClient,
      payer: employer,
      mint,
      decimals: 2,
      tokenProgram: TOKEN_PROGRAM_ID,
    });

    const companyName = "new_company";

    await employerProvidedProgram.methods
      .createVestingAccount(companyName)
      .accounts({
        signer: employer.publicKey,
        mint: mint.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: "finalized" });

    const [vestingAccountKey] = PublicKey.findProgramAddressSync(
      [Buffer.from(companyName)],
      program.programId
    );

    const amount = 10_000 * 10 ** 9;

    const [treasuryTokenAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("vesting_treasury"), Buffer.from(companyName)],
      program.programId
    );

    await mintTo({
      banksClient,
      payer: employer,
      mint: mint.publicKey,
      destination: treasuryTokenAccount,
      amount,
    });

    const vestingAccountData = await program.account.vestingAccount.fetch(
      vestingAccountKey,
      "finalized"
    );

    console.log(vestingAccountData);

    await employerProvidedProgram.methods
      .createEmployeeVesting(new BN(0), new BN(100), new BN(100), new BN(0))
      .accounts({
        beneficiary: beneficiary.publicKey,
        vestingAccount: vestingAccountKey,
      })
      .rpc({ commitment: "finalized", skipPreflight: true });

    const currentClock = await banksClient.getClock();
    context.setClock(
      new Clock(
        currentClock.slot,
        currentClock.epochStartTimestamp,
        currentClock.epoch,
        currentClock.leaderScheduleEpoch,
        1000n
      )
    );

    console.log(await banksClient.getAccount(treasuryTokenAccount));

    // console.log("Employee account", employeeAccount.toBase58());

    const tx3 = await beneficiaryProvidedProgram.methods
      .claimTokens(companyName)
      .accounts({
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });

    console.log("Claim Tokens transaction signature", tx3);
  });
});
