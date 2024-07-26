import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import wallet from "./dev.json";

// 7L1MKR11qLHLCMzqGNcDNiqwEckapAi55D4xSWgGEb2C
(async () => {
  const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
  const connection = new Connection(clusterApiUrl("devnet"));
  try {
    // We're going to claim 2 devnet SOL tokens
    const txhash = await connection.requestAirdrop(
      keypair.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
