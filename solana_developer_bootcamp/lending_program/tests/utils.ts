import { BanksClient, BanksTransactionMeta } from "solana-bankrun";
import {
  Keypair,
  PublicKey,
  Signer,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  createInitializeMint2Instruction,
  createMintToInstruction,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export function getUserAccountPda(user: PublicKey, program: PublicKey) {
  return PublicKey.findProgramAddressSync([user.toBuffer()], program)[0];
}

export function getBankAccountPda(mint: PublicKey, program: PublicKey) {
  return PublicKey.findProgramAddressSync([mint.toBuffer()], program)[0];
}

export function getTreasuryAccountPda(mint: PublicKey, program: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("treasury"), mint.toBuffer()],
    program
  )[0];
}
export function getAssociatedTokenAccountPda(
  owner: PublicKey,
  mint: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  )[0];
}

export async function createMint(
  banksClient: BanksClient,
  payer: Keypair,
  mintAuthority: PublicKey,
  freezeAuthority: PublicKey | null,
  decimals: number,
  keypair = Keypair.generate(),
  programId = TOKEN_PROGRAM_ID
): Promise<PublicKey> {
  let rent = await banksClient.getRent();

  const tx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: keypair.publicKey,
      space: MINT_SIZE,
      lamports: Number(await rent.minimumBalance(BigInt(MINT_SIZE))),
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMint2Instruction(
      keypair.publicKey,
      decimals,
      mintAuthority,
      freezeAuthority,
      programId
    )
  );
  [tx.recentBlockhash] = (await banksClient.getLatestBlockhash())!;
  tx.sign(payer, keypair);

  await banksClient.processTransaction(tx);

  return keypair.publicKey;
}

export function getSigners(
  signerOrMultisig: Signer | PublicKey,
  multiSigners: Signer[]
): [PublicKey, Signer[]] {
  return signerOrMultisig instanceof PublicKey
    ? [signerOrMultisig, multiSigners]
    : [signerOrMultisig.publicKey, [signerOrMultisig]];
}

export async function mintTo(
  banksClient: BanksClient,
  payer: Signer,
  mint: PublicKey,
  destination: PublicKey,
  authority: Signer | PublicKey,
  amount: number | bigint,
  multiSigners: Signer[] = [],
  programId = TOKEN_PROGRAM_ID
): Promise<BanksTransactionMeta> {
  const [authorityPublicKey, signers] = getSigners(authority, multiSigners);

  const tx = new Transaction().add(
    createMintToInstruction(
      mint,
      destination,
      authorityPublicKey,
      amount,
      multiSigners,
      programId
    )
  );
  [tx.recentBlockhash] = (await banksClient.getLatestBlockhash())!;
  tx.sign(payer, ...signers);

  return await banksClient.processTransaction(tx);
}

export async function createATA(
  banksClient: BanksClient,
  payer: Signer,
  destination: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
  authority: Signer | PublicKey,
  multiSigners: Signer[] = [],
  programId = TOKEN_PROGRAM_ID
): Promise<BanksTransactionMeta> {
  const [authorityPublicKey, signers] = getSigners(authority, multiSigners);

  const tx = new Transaction().add(
    createAssociatedTokenAccountIdempotentInstruction(
      payer.publicKey,
      destination,
      owner,
      mint,
      programId,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  );
  [tx.recentBlockhash] = (await banksClient.getLatestBlockhash())!;
  tx.sign(payer, ...signers);

  return await banksClient.processTransaction(tx);
}
