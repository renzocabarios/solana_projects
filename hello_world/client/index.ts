import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { PRIVATE_KEY } from "./env";
import bs58 from "bs58";

const keyPair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const main = async () => {
  const transaction = new Transaction();
  transaction.add(
    new TransactionInstruction({
      keys: [],
      programId: new PublicKey("DSuVG3dnbYtJJfoCEv7LQjvYBnE1zgPBe6jtbRKxE2Ym"),
    })
  );
  console.log("Sending transaction...");
  const txHash = await sendAndConfirmTransaction(connection, transaction, [
    keyPair,
  ]);
  console.log("Transaction sent with hash:", txHash);
};

main();
