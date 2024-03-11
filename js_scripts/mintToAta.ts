// import {
//   Transaction,
//   TransactionInstruction,
//   sendAndConfirmTransaction,
// } from "@solana/web3.js";
// import {
//   createMintTransaction,
//   generateKeypair,
//   getAssociatedTokenAccount,
//   getAssociatedTokenAccountOrInstruction,
//   getEstimatedFee,
//   getPayerKeypair,
//   mintToInstruction,
// } from "./utils";
// import { CONNECTION } from "./config";

// // TODO: Finish this
// const main = async () => {
//   const mintKeypair = generateKeypair();
//   let transaction = new Transaction();

//   const ataOrInstruction = await getAssociatedTokenAccountOrInstruction(
//     mintKeypair.publicKey
//   );

//   if (ataOrInstruction instanceof TransactionInstruction) {
//     transaction = await createMintTransaction(6, mintKeypair);
//     transaction.add(ataOrInstruction);
//   } else {
//     const ata = await getAssociatedTokenAccount(mintKeypair.publicKey);
//     transaction.add(mintToInstruction(mintKeypair.publicKey, ata.address, 1));
//   }

//   const estimatedFee = await getEstimatedFee(
//     transaction,
//     getPayerKeypair().publicKey
//   );

//   console.log(`estimated fee: ${estimatedFee}`);

//   const tx = await sendAndConfirmTransaction(CONNECTION, transaction, [
//     getPayerKeypair(),
//     mintKeypair,
//   ]);

//   console.log(`Mint ID: ${mintKeypair.publicKey.toString()}`);
//   console.log(`TX: ${tx.toString()}`);
// };

// main();
