import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token";
import { Transaction } from "@solana/web3.js";
import { MINT, PROVIDER, TO_WALLET } from "./constants";
import { confirm, getSigners } from "./helpers";

export function createATA() {
  it("Create From ATA", async () => {
    const associatedToken = getAssociatedTokenAddressSync(
      MINT.publicKey,
      PROVIDER.publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const createATAInstruction = createAssociatedTokenAccountInstruction(
      PROVIDER.publicKey,
      associatedToken,
      PROVIDER.publicKey,
      MINT.publicKey,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const [authorityPublicKey, signers] = getSigners(PROVIDER.publicKey, []);
    const mintToInstruction = createMintToInstruction(
      MINT.publicKey,
      associatedToken,
      authorityPublicKey,
      10000000000,
      [],
      TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction()
      .add(createATAInstruction)
      .add(mintToInstruction);

    await PROVIDER.sendAndConfirm(transaction).then(confirm);
  });

  it("Create To ATA", async () => {
    const associatedToken = getAssociatedTokenAddressSync(
      MINT.publicKey,
      TO_WALLET.publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const createATAInstruction = createAssociatedTokenAccountInstruction(
      PROVIDER.publicKey,
      associatedToken,
      TO_WALLET.publicKey,
      MINT.publicKey,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction().add(createATAInstruction);

    await PROVIDER.sendAndConfirm(transaction).then(confirm);
  });
}
