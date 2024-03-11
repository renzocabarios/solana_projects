import {
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createAccountWithSeedInstruction,
  generateAccountWithSeed,
  getPayerKeypair,
} from "./utils";
import { CONNECTION } from "./config";

const main = async () => {
  const keypair = getPayerKeypair();
  let seed = "robot001";

  const account = await generateAccountWithSeed(keypair.publicKey, seed);

  const transaction = new Transaction().add(
    createAccountWithSeedInstruction(
      keypair.publicKey,
      new PublicKey(account),
      seed
    )
  );

  console.log(
    `txhash: ${await sendAndConfirmTransaction(CONNECTION, transaction, [
      keypair,
      keypair,
    ])}`
  );
};

main();
