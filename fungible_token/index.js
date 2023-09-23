import * as token from "@solana/spl-token";
import { ACCOUNT, CONNECTION } from "./config.js";

// FIX: bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?)
async function main() {
  const mint = await token.createMint(
    CONNECTION,
    ACCOUNT,
    ACCOUNT.publicKey,
    ACCOUNT.publicKey,
    9
  );

  console.log("Mint ID: ", mint.toString());

  const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
    CONNECTION,
    ACCOUNT,
    mint,
    ACCOUNT.publicKey
  );

  console.log("Token Account ID: ", tokenAccount.address.toString());

  const tx = await token.mintTo(
    CONNECTION,
    ACCOUNT,
    mint,
    tokenAccount.address,
    ACCOUNT,
    100
  );

  console.log("Mint To Transaction: ", tx.toString());

  const mintInfo = await token.getMint(CONNECTION, mint);

  const tokenAccountInfo = await token.getAccount(
    CONNECTION,
    tokenAccount.address
  );

  console.log("Token Circulation Supply: ", mintInfo.supply);
  console.log("Token Account Supply: ", tokenAccountInfo.amount);
}

main();
