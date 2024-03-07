import { PublicKey, Keypair } from "@solana/web3.js";
import { airdropTo, getAccountBalance } from "./utils";

const main = async () => {
  const publicKey = new PublicKey(process.argv[2] ?? new Keypair().publicKey);
  const sol = Number(process.argv[3] ?? 5);
  await airdropTo(publicKey, sol);
  const accountBalance = await getAccountBalance(publicKey);
  console.log(`Account: ${publicKey} has ${accountBalance} SOL`);
  console.log(`Account: ${publicKey} has ${accountBalance} SOL`);
};

main();
