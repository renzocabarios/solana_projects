import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";

const start = async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const recentBlockhash = await connection.getLatestBlockhash();
  const from = Keypair.generate();
  const to = Keypair.generate();

  const transaction = new Transaction({
    blockhash: recentBlockhash.blockhash,
    lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
  }).add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to.publicKey,
      lamports: 10,
    })
  );

  transaction.feePayer = from.publicKey;
  const fees = await transaction.getEstimatedFee(connection);
  console.log(`Estimated SOL transfer cost: ${fees} lamports`);
};

start();
