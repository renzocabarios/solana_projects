import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import wallet from "./dev.json";

// 7L1MKR11qLHLCMzqGNcDNiqwEckapAi55D4xSWgGEb2C
(async () => {
  const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
  const to = Keypair.generate();
  const connection = new Connection(clusterApiUrl("devnet"));
  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: to.publicKey,
        lamports: LAMPORTS_PER_SOL / 100,
      })
    );
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;

    transaction.feePayer = keypair.publicKey;

    // Sign transaction, broadcast, and confirm
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);
    console.log(`Success! Check out your TX here: 
  https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
