import {
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  generateKeypair,
  getPayerATA,
  getEstimatedFee,
  getPayerKeypair,
  mintToInstruction,
} from "./utils";
import { CONNECTION } from "./config";
import { mintTo } from "@solana/spl-token";

const main = async () => {
  const SUPPLY = 1000000;
  const mintKeypair = generateKeypair();

  const mintId = new PublicKey(process.argv[2] ?? mintKeypair.publicKey);

  const associatedToken = getPayerATA(mintId);

  const transaction = new Transaction().add(
    mintToInstruction(mintId, associatedToken, SUPPLY)
  );

  const estimatedFee = await getEstimatedFee(
    transaction,
    getPayerKeypair().publicKey
  );
  console.log(`estimated fee: ${estimatedFee}`);

  const tx = await sendAndConfirmTransaction(CONNECTION, transaction, [
    getPayerKeypair(),
  ]);

  console.log(`Mint ID: ${mintId.toString()}`);
  console.log(`TX: ${tx.toString()}`);

  mintTo;
};

main();
