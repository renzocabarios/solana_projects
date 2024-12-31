import { Program } from "@coral-xyz/anchor";
import { LotteryProgram } from "../target/types/lottery_program";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import {
  Keypair,
  PublicKey,
  Signer,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { BanksClient } from "solana-bankrun";
import {
  createInitializeMint2Instruction,
  createMintToInstruction,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

const IDL = require("../target/idl/lottery_program.json");

export async function envSetup() {
  const employer = Keypair.generate();
  const beneficiary = Keypair.generate();

  const context = await startAnchor(
    "",
    [],
    [
      {
        address: employer.publicKey,
        info: {
          lamports: 1_000_000_000,
          data: Buffer.alloc(0),
          owner: SYSTEM_PROGRAM_ID,
          executable: false,
        },
      },
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

  const provider = new BankrunProvider(context);
  const banksClient = context.banksClient;
  const program = new Program<LotteryProgram>(IDL, provider);

  const employerProvider = new BankrunProvider(context);
  employerProvider.wallet = new NodeWallet(employer);
  const employerProvidedProgram = new Program<LotteryProgram>(
    IDL,
    employerProvider
  );

  const beneficiaryProvider = new BankrunProvider(context);
  beneficiaryProvider.wallet = new NodeWallet(beneficiary);
  const beneficiaryProvidedProgram = new Program<LotteryProgram>(
    IDL,
    beneficiaryProvider
  );

  return {
    context,
    banksClient,
    provider,
    program,
    wallet: provider.wallet,
    employer,
    beneficiary,
    employerProvider,
    employerProvidedProgram,
    beneficiaryProvider,
    beneficiaryProvidedProgram,
  };
}

interface ICreateMintArgs {
  banksClient: BanksClient;
  payer: Signer;
  mint: Signer;
  decimals: number;
  tokenProgram: PublicKey;
}

export async function createMint({
  banksClient,
  payer,
  mint,
  decimals,
  tokenProgram = TOKEN_PROGRAM_ID,
}: ICreateMintArgs) {
  let rent = await banksClient.getRent();

  const tx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint.publicKey,
      space: MINT_SIZE,
      lamports: Number(await rent.minimumBalance(BigInt(MINT_SIZE))),
      programId: tokenProgram,
    }),
    createInitializeMint2Instruction(
      mint.publicKey,
      decimals,
      payer.publicKey,
      payer.publicKey,
      tokenProgram
    )
  );
  [tx.recentBlockhash] = (await banksClient.getLatestBlockhash())!;
  tx.sign(payer, mint);

  await banksClient.processTransaction(tx);
}

interface IMintToArgs {
  banksClient: BanksClient;
  payer: Signer;
  mint: PublicKey;
  destination: PublicKey;
  amount: number;
  multiSigners?: Signer[];
  tokenProgram?: PublicKey;
}

export async function mintTo({
  banksClient,
  payer,
  mint,
  destination,
  multiSigners = [],
  amount,
  tokenProgram = TOKEN_PROGRAM_ID,
}: IMintToArgs) {
  const [authorityPublicKey, signers] = getSigners(payer, multiSigners);

  const tx = new Transaction().add(
    createMintToInstruction(
      mint,
      destination,
      authorityPublicKey,
      amount,
      multiSigners,
      tokenProgram
    )
  );
  [tx.recentBlockhash] = (await banksClient.getLatestBlockhash())!;
  tx.sign(payer, ...signers);

  await banksClient.processTransaction(tx);
}

export function getSigners(
  signerOrMultisig: Signer | PublicKey,
  multiSigners: Signer[]
): [PublicKey, Signer[]] {
  return signerOrMultisig instanceof PublicKey
    ? [signerOrMultisig, multiSigners]
    : [signerOrMultisig.publicKey, [signerOrMultisig]];
}
