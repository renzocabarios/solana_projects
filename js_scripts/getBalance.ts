import { PublicKey, Keypair } from "@solana/web3.js";
import { generateKeypair, getAccountBalance } from "./utils";

const main = async () => {
  const publicKey = new PublicKey(
    process.argv[2] ?? generateKeypair().publicKey
  );
  const accountBalance = await getAccountBalance(publicKey);
  console.log(`Account: ${publicKey} has ${accountBalance} SOL`);
};

main();
