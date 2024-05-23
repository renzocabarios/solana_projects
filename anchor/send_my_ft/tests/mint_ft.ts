import * as anchor from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
} from "@solana/spl-token";
import { SystemProgram, Transaction } from "@solana/web3.js";
import { CONNECTION, MINT, PROVIDER } from "./constants";
import { confirm } from "./helpers";

export function mintFT() {
  it("Minted tokens", async () => {
    const lamports = await getMinimumBalanceForRentExemptMint(CONNECTION);
    const createAccountIntruction = SystemProgram.createAccount({
      fromPubkey: PROVIDER.publicKey,
      newAccountPubkey: MINT.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    });

    const initializeMintIntruction = createInitializeMint2Instruction(
      MINT.publicKey,
      6,
      PROVIDER.publicKey,
      PROVIDER.publicKey,
      TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction()
      .add(createAccountIntruction)
      .add(initializeMintIntruction);

    await PROVIDER.sendAndConfirm(transaction, [MINT]).then(confirm);
  });
}
