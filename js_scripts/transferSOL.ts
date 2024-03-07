import { PublicKey } from "@solana/web3.js";
import { generateKeypair, transferSOL } from "./utils";

const main = async () => {
  const to = new PublicKey(process.argv[2] ?? generateKeypair().publicKey);
  const sol = Number(process.argv[3] ?? 1);
  const signature = await transferSOL(to, sol);
  console.log(`sent ${sol} SOL to ${to.toString()}`);
  console.log(`signature: ${signature}`);
};

main();
