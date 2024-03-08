import { sendAndConfirmTransaction } from "@solana/web3.js";
import {
  createMintTransaction,
  generateKeypair,
  getEstimatedFee,
  getPayerKeypair,
} from "./utils";
import { CONNECTION } from "./config";

const main = async () => {
  const mintKeypair = generateKeypair();
  const transaction = await createMintTransaction(6, mintKeypair);
  const estimatedFee = await getEstimatedFee(
    transaction,
    getPayerKeypair().publicKey
  );

  console.log(`estimated fee: ${estimatedFee}`);

  const tx = await sendAndConfirmTransaction(CONNECTION, transaction, [
    getPayerKeypair(),
    mintKeypair,
  ]);
  console.log(`Mint ID: ${mintKeypair.publicKey.toString()}`);
  console.log(`TX: ${tx.toString()}`);
};

main();
