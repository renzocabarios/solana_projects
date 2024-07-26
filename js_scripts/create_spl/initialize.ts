import { createMint } from "@solana/spl-token";
import { CONNECTION, MINT_DECIMALS, PAYER_KEYPAIR } from "./config";

(async () => {
  try {
    const mint = await createMint(
      CONNECTION,
      PAYER_KEYPAIR,
      PAYER_KEYPAIR.publicKey,
      PAYER_KEYPAIR.publicKey,
      MINT_DECIMALS
    );

    console.log(mint.toString());
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
