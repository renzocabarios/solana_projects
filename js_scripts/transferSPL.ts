import { createTransferInstruction } from "@solana/spl-token";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  getPayerATA,
  getAssociatedTokenAccountOrInstruction,
  getPayerKeypair,
  getNumberDecimals,
  getATA,
  getEstimatedFee,
} from "./utils";
import { CONNECTION } from "./config";

const main = async () => {
  const mint = new PublicKey(process.argv[2]);
  const to = new PublicKey(process.argv[3]);

  const transaction = new Transaction();
  const payerAta = getPayerATA(mint);
  const toAta = getATA(mint, to);

  const accountOrInstruction = await getAssociatedTokenAccountOrInstruction(
    to,
    mint
  );

  if (accountOrInstruction instanceof TransactionInstruction) {
    transaction.add(accountOrInstruction);
  }

  const numberDecimals = await getNumberDecimals(mint);

  transaction.add(
    createTransferInstruction(
      payerAta,
      toAta,
      getPayerKeypair().publicKey,
      Number(process.argv[4]) * Math.pow(10, numberDecimals)
    )
  );

  console.log(
    "Estimated Fee:",
    await getEstimatedFee(transaction, getPayerKeypair().publicKey)
  );

  const hash = await sendAndConfirmTransaction(CONNECTION, transaction, [
    getPayerKeypair(),
  ]);

  console.log("Hash:", hash);
};

main();
