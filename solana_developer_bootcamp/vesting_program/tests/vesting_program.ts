import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { VestingProgram } from "../target/types/vesting_program";
import {
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMint2Instruction,
  createMint,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import IDL from "../target/idl/vesting_program.json";
import {
  startAnchor,
  Clock,
  BanksClient,
  ProgramTestContext,
} from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
describe("vesting_program", () => {
  const companyName = "Company";
  let beneficiary: Keypair;
  let vestingAccountKey: PublicKey;
  let treasuryTokenAccount: PublicKey;
  let employeeAccount: PublicKey;
  let provider: BankrunProvider;
  let program: Program<VestingProgram>;
  let banksClient: BanksClient;
  let employer: Keypair;
  let mint: PublicKey;
  let beneficiaryProvider: BankrunProvider;
  let program2: Program<VestingProgram>;
  let context: ProgramTestContext;

  before(async () => {
    beneficiary = new anchor.web3.Keypair();

    // set up bankrun
    context = await startAnchor(
      "",
      [{ name: "vesting", programId: new PublicKey(IDL.address) }],
      [
        {
          address: beneficiary.publicKey,
          info: {
            lamports: 1_000_000_000,
            data: Buffer.alloc(0),
            owner: SYSTEM_PROGRAM_ID,
            executable: false,
          },
        },
      ]
    );
    provider = new BankrunProvider(context);

    anchor.setProvider(provider);

    program = new Program<VestingProgram>(IDL as VestingProgram, provider);

    banksClient = context.banksClient;

    employer = provider.wallet.payer;

    // Create a new mint
    // @ts-ignore
    mint = await createMint(banksClient, employer, employer.publicKey, null, 2);

    // Generate a new keypair for the beneficiary
    beneficiaryProvider = new BankrunProvider(context);
    beneficiaryProvider.wallet = new NodeWallet(beneficiary);

    program2 = new Program<VestingProgram>(
      IDL as VestingProgram,
      beneficiaryProvider
    );

    // Derive PDAs
    [vestingAccountKey] = PublicKey.findProgramAddressSync(
      [Buffer.from(companyName)],
      program.programId
    );

    [treasuryTokenAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("vesting_treasury"), Buffer.from(companyName)],
      program.programId
    );

    [employeeAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("employee_vesting"),
        beneficiary.publicKey.toBuffer(),
        vestingAccountKey.toBuffer(),
      ],
      program.programId
    );
  });

  it("should create a vesting account", async () => {
    const tx = await program.methods
      .createVestingAccount(companyName)
      .accounts({
        signer: employer.publicKey,
        mint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc({ commitment: "confirmed" });

    const vestingAccountData = await program.account.vestingAccount.fetch(
      vestingAccountKey,
      "confirmed"
    );
    console.log(
      "Vesting Account Data:",
      JSON.stringify(vestingAccountData, null, 2)
    );

    console.log("Create Vesting Account Transaction Signature:", tx);
  });

  // it("should fund the treasury token account", async () => {
  //   const amount = 10_000 * 10 ** 9;
  //   const mintTx = await mintTo(
  //     connection,
  //     employer,
  //     mint,
  //     treasuryTokenAccount,
  //     employer,
  //     amount
  //   );

  //   console.log("Mint to Treasury Transaction Signature:", mintTx);
  // });

  // it("should create an employee vesting account", async () => {
  //   const tx2 = await program.methods
  //     .createEmployeeVesting(new BN(0), new BN(100), new BN(100), new BN(0))
  //     .accounts({
  //       beneficiary: beneficiary.publicKey,
  //       vestingAccount: vestingAccountKey,
  //     })
  //     .signers([employer])
  //     .rpc({ commitment: "confirmed", skipPreflight: true });

  //   console.log("Create Employee Account Transaction Signature:", tx2);
  //   console.log("Employee account", employeeAccount.toBase58());
  // });
});
