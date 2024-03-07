import { PublicKey, Keypair } from "@solana/web3.js";
import { getAccountBalance } from "./utils";

const main = async () => {
  const publicKey = new PublicKey(process.argv[2] ?? new Keypair().publicKey);
  const accountBalance = await getAccountBalance(publicKey);
  console.log(`Account: ${publicKey} has ${accountBalance} SOL`);
};

main();
