import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createMintToInstruction,
} from "@solana/spl-token";
import { SendMyFt } from "../target/types/send_my_ft";
import { PublicKey, Signer } from "@solana/web3.js";
import { SystemProgram, Transaction } from "@solana/web3.js";
import { assert } from "chai";

describe("send_my_ft", () => {
  const provider = anchor.AnchorProvider.local();
  const connection = provider.connection;
  anchor.setProvider(provider);

  const program = anchor.workspace.SendMyFt as Program<SendMyFt>;
  const to_wallet = new anchor.web3.Keypair();

  function getSigners(
    signerOrMultisig: Signer | PublicKey,
    multiSigners: Signer[]
  ): [PublicKey, Signer[]] {
    return signerOrMultisig instanceof PublicKey
      ? [signerOrMultisig, multiSigners]
      : [signerOrMultisig.publicKey, [signerOrMultisig]];
  }

  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({ signature, ...block });
    return signature;
  };

  const mint = new anchor.web3.Keypair();

  it("Minted tokens", async () => {
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const createAccountIntruction = SystemProgram.createAccount({
      fromPubkey: provider.publicKey,
      newAccountPubkey: mint.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    });

    const initializeMintIntruction = createInitializeMint2Instruction(
      mint.publicKey,
      6,
      provider.publicKey,
      provider.publicKey,
      TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction()
      .add(createAccountIntruction)
      .add(initializeMintIntruction);

    await provider.sendAndConfirm(transaction, [mint]).then(confirm);
  });

  it("Create From ATA", async () => {
    const associatedToken = getAssociatedTokenAddressSync(
      mint.publicKey,
      provider.publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const createATAInstruction = createAssociatedTokenAccountInstruction(
      provider.publicKey,
      associatedToken,
      provider.publicKey,
      mint.publicKey,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const [authorityPublicKey, signers] = getSigners(provider.publicKey, []);
    const mintToInstruction = createMintToInstruction(
      mint.publicKey,
      associatedToken,
      authorityPublicKey,
      10000000000,
      [],
      TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction()
      .add(createATAInstruction)
      .add(mintToInstruction);

    await provider.sendAndConfirm(transaction).then(confirm);
  });

  it("Create To ATA", async () => {
    const associatedToken = getAssociatedTokenAddressSync(
      mint.publicKey,
      to_wallet.publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const createATAInstruction = createAssociatedTokenAccountInstruction(
      provider.publicKey,
      associatedToken,
      to_wallet.publicKey,
      mint.publicKey,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction().add(createATAInstruction);

    await provider.sendAndConfirm(transaction).then(confirm);
  });

  it("Is initialized!", async () => {
    const toATA = await getAssociatedTokenAddress(
      mint.publicKey,
      to_wallet.publicKey
    );

    const fromAta = await getAssociatedTokenAddress(
      mint.publicKey,
      provider.publicKey
    );

    await program.methods
      .sendFt(new anchor.BN(10))
      .accounts({
        from: provider.publicKey,
        fromAta: fromAta,
        toAta: toATA,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc()
      .then(confirm);

    const info = await connection.getTokenAccountBalance(toATA);
    assert.equal(10, Number(info.value.amount));
  });
});
