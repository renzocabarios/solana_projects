import { PublicKey } from "@solana/web3.js";
import { airdropTo, generateKeypair, getAccountBalance } from "./utils";

const main = async () => {
  const publicKey = new PublicKey(
    process.argv[2] ?? generateKeypair().publicKey
  );
  const sol = Number(process.argv[3] ?? 5);
  await airdropTo(publicKey, sol);
  const accountBalance = await getAccountBalance(publicKey);
  console.log(`Account: ${publicKey} has ${accountBalance} SOL`);
};

main();
