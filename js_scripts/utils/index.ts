import {
  BlockhashWithExpiryBlockHeight,
  Commitment,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  RpcResponseAndContext,
  SignatureResult,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { CONNECTION } from "../config";
import bs58 from "bs58";
import { PAYER_PRIVATE_KEY } from "../env";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Account,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  TokenInvalidMintError,
  TokenInvalidOwnerError,
  createAssociatedTokenAccountInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";

export async function generateAccountWithSeed(base: PublicKey, seed: string) {
  return (
    await PublicKey.createWithSeed(base, seed, SystemProgram.programId)
  ).toBase58();
}

// export function mintToInstruction(
//   mint: PublicKey,
//   destination: PublicKey,
//   amount: number | bigint
// ): TransactionInstruction {
//   // const [authorityPublicKey, signers] = getSigners(getPayerKeypair(), []);
//   return createMintToInstruction(
//     mint,
//     destination,
//     authorityPublicKey,
//     amount,
//     [],
//     TOKEN_PROGRAM_ID
//   );
// }

export async function getAssociatedTokenAccount(
  mint: PublicKey,
  allowOwnerOffCurve = false,
  commitment?: Commitment
): Promise<Account> {
  const associatedToken = getAssociatedTokenAddressSync(
    mint,
    getPayerKeypair().publicKey,
    allowOwnerOffCurve,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  return await getAccount(
    CONNECTION,
    associatedToken,
    commitment,
    TOKEN_PROGRAM_ID
  );
}

export async function getAssociatedTokenAccountOrInstruction(
  mint: PublicKey,
  allowOwnerOffCurve = false,
  commitment?: Commitment
): Promise<Account | TransactionInstruction> {
  let err: unknown;

  const associatedToken = getAssociatedTokenAddressSync(
    mint,
    getPayerKeypair().publicKey,
    allowOwnerOffCurve,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  try {
    const account = await getAccount(
      CONNECTION,
      associatedToken,
      commitment,
      TOKEN_PROGRAM_ID
    );

    if (!account.mint.equals(mint)) throw new TokenInvalidMintError();
    if (!account.owner.equals(getPayerKeypair().publicKey))
      throw new TokenInvalidOwnerError();
  } catch (error: unknown) {
    err = error;
  }

  const hasInvalidATA =
    err instanceof TokenAccountNotFoundError ||
    err instanceof TokenInvalidAccountOwnerError;

  return hasInvalidATA
    ? createAssociatedTokenAccountInstruction(
        getPayerKeypair().publicKey,
        associatedToken,
        getPayerKeypair().publicKey,
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    : await getAccount(
        CONNECTION,
        associatedToken,
        commitment,
        TOKEN_PROGRAM_ID
      );
}

export async function getMinimumBalanceForRentExemption(
  space: number
): Promise<number> {
  return await CONNECTION.getMinimumBalanceForRentExemption(space);
}

export async function createMintTransaction(
  decimals: number,
  keypair = Keypair.generate(),
  programId = TOKEN_PROGRAM_ID
): Promise<Transaction> {
  const lamports = await getMinimumBalanceForRentExemptMint(CONNECTION);
  return new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: getPayerKeypair().publicKey,
      newAccountPubkey: keypair.publicKey,
      lamports,
      space: MINT_SIZE,
      programId,
    }),
    createInitializeMint2Instruction(
      keypair.publicKey,
      decimals,
      getPayerKeypair().publicKey,
      getPayerKeypair().publicKey,
      programId
    )
  );
}

export async function systemProgramCreateAccountInstruction(
  fromPubkey: PublicKey,
  newAccountPubkey: PublicKey,
  space: number
): Promise<TransactionInstruction> {
  const rentExemptionAmount = await getMinimumBalanceForRentExemption(space);

  return SystemProgram.createAccount({
    fromPubkey,
    newAccountPubkey,
    lamports: rentExemptionAmount,
    space,
    programId: SystemProgram.programId,
  });
}

export async function createAccount(
  newAccountKeypair: Keypair,
  space: number
): Promise<TransactionSignature> {
  const payerKeypair = getPayerKeypair();
  const transaction = new Transaction().add(
    await systemProgramCreateAccountInstruction(
      payerKeypair.publicKey,
      newAccountKeypair.publicKey,
      space
    )
  );

  const estimatedFee = await getEstimatedFee(
    transaction,
    payerKeypair.publicKey
  );

  console.log("Estimated SOL Fee", estimatedFee);

  return await sendAndConfirmTransaction(CONNECTION, transaction, [
    payerKeypair,
    newAccountKeypair,
  ]);
}

export function systemProgramTransferInstruction(
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  sol: number
): TransactionInstruction {
  return SystemProgram.transfer({
    fromPubkey,
    toPubkey,
    lamports: SOLtoLamports(sol),
  });
}

export async function transferSOL(
  to: PublicKey,
  sol: number
): Promise<TransactionSignature> {
  const payerKeypair = getPayerKeypair();
  const transaction = new Transaction().add(
    systemProgramTransferInstruction(payerKeypair.publicKey, to, sol)
  );

  const estimatedFee = await getEstimatedFee(
    transaction,
    payerKeypair.publicKey
  );
  console.log("Estimated SOL Fee", estimatedFee);

  return await sendAndConfirmTransaction(CONNECTION, transaction, [
    payerKeypair,
  ]);
}

export function getPayerKeypair(): Keypair {
  return Keypair.fromSecretKey(bs58.decode(PAYER_PRIVATE_KEY));
}

export function SOLtoLamports(value: number): number {
  return value * LAMPORTS_PER_SOL;
}

export function LamportstoSOL(value: number): number {
  return value / LAMPORTS_PER_SOL;
}

export async function getAccountBalance(publicKey: PublicKey): Promise<number> {
  const walletBalance = await CONNECTION.getBalance(publicKey);
  return walletBalance / LAMPORTS_PER_SOL;
}

export async function airdropTo(
  publicKey: PublicKey,
  sol: number
): Promise<string> {
  const airdropSignature = await requestAirdrop(publicKey, LamportstoSOL(sol));
  await confirmTransaction(airdropSignature);
  return airdropSignature;
}

export async function requestAirdrop(
  publicKey: PublicKey,
  lamports: number
): Promise<string> {
  return await CONNECTION.requestAirdrop(publicKey, lamports);
}

export async function confirmTransaction(
  signature: string
): Promise<RpcResponseAndContext<SignatureResult>> {
  const { blockhash, lastValidBlockHeight } = await getLatestBlockhash();
  return await CONNECTION.confirmTransaction({
    blockhash: blockhash,
    lastValidBlockHeight: lastValidBlockHeight,
    signature,
  });
}

export async function getLatestBlockhash(): Promise<BlockhashWithExpiryBlockHeight> {
  return await CONNECTION.getLatestBlockhash();
}

export function generateKeypair(): Keypair {
  return Keypair.generate();
}

export async function getEstimatedFee(
  transaction: Transaction,
  feepayer: PublicKey
): Promise<number | null> {
  const { blockhash, lastValidBlockHeight } = await getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = feepayer;
  return LamportstoSOL(
    Number((await transaction.getEstimatedFee(CONNECTION)) ?? 0)
  );
}
