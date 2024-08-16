import {
  clusterApiUrl,
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

import {
  ExtensionType,
  createInitializeMintInstruction,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
  createMintToInstruction,
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createInitializeNonTransferableMintInstruction,
  createTransferInstruction,
} from "@solana/spl-token";

import wallet from "./wallet.json";

(async () => {
  const payer = Keypair.fromSecretKey(new Uint8Array(wallet));
  console.log(payer.publicKey.toString());

  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;
  console.log(mint.toString());

  const extensions = [ExtensionType.NonTransferable];

  const mintLen = getMintLen(extensions);
  // const mintLen = MINT_SIZE;

  const decimals = 2;

  const connection = new Connection(clusterApiUrl("devnet"), "finalized");

  const mintLamports = await connection.getMinimumBalanceForRentExemption(
    mintLen
  );

  const associatedToken = getAssociatedTokenAddressSync(
    mint,
    payer.publicKey,
    true,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const mintTransaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint,
      space: mintLen,
      lamports: mintLamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeNonTransferableMintInstruction(
      mint, // Mint Account address
      TOKEN_2022_PROGRAM_ID // Token Extension Program ID
    ),
    createInitializeMintInstruction(
      mint,
      decimals,
      payer.publicKey,
      payer.publicKey,
      TOKEN_2022_PROGRAM_ID
    ),
    createAssociatedTokenAccountIdempotentInstruction(
      payer.publicKey,
      associatedToken,
      payer.publicKey,
      mint,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    ),
    createMintToInstruction(
      mint,
      associatedToken,
      payer.publicKey,
      100000000,
      [],
      TOKEN_2022_PROGRAM_ID
    )
  );

  const tx = await sendAndConfirmTransaction(
    connection,
    mintTransaction,
    [payer, mintKeypair],
    undefined
  );

  console.log(tx);

  const toKeypair = Keypair.generate();

  const associatedTokenTo = getAssociatedTokenAddressSync(
    mint,
    toKeypair.publicKey,
    true,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  console.log();

  const tx1 = new Transaction().add(
    createAssociatedTokenAccountIdempotentInstruction(
      payer.publicKey,
      associatedTokenTo,
      toKeypair.publicKey,
      mint,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    ),
    createTransferInstruction(
      associatedToken,
      associatedTokenTo,
      payer.publicKey,
      100000000,
      undefined,
      TOKEN_2022_PROGRAM_ID
    )
  );

  const tx1hash = await sendAndConfirmTransaction(
    connection,
    tx1,
    [payer],
    undefined
  );

  console.log(tx1hash);
})();
