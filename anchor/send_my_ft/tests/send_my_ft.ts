import * as anchor from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { assert } from "chai";
import {
  CONNECTION,
  MINT,
  PROVIDER,
  SEND_MY_FT_PROGRAM,
  TO_WALLET,
} from "./constants";
import { confirm, runTest } from "./helpers";
import { mintFT } from "./mint_ft";
import { createATA } from "./create_ata";

describe("Setup", () => {
  runTest("Create FT", mintFT);
  runTest("Create ATA", createATA);
});

describe("Programs", () => {
  it("Is initialized!", async () => {
    const toATA = await getAssociatedTokenAddress(
      MINT.publicKey,
      TO_WALLET.publicKey
    );

    const fromAta = await getAssociatedTokenAddress(
      MINT.publicKey,
      PROVIDER.publicKey
    );

    await SEND_MY_FT_PROGRAM.methods
      .sendFt(new anchor.BN(10))
      .accounts({
        from: PROVIDER.publicKey,
        fromAta: fromAta,
        toAta: toATA,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc()
      .then(confirm);

    const info = await CONNECTION.getTokenAccountBalance(toATA);
    assert.equal(10, Number(info.value.amount));
  });
});
