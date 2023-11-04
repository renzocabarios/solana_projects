import * as solanaWeb3 from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

// const DEV_NET = solanaWeb3.clusterApiUrl("devnet");
// const solanaConnection = new solanaWeb3.Connection(DEV_NET);

export async function GET() {
  const keypair = Keypair.generate();
  return Response.json({
    publicKey: keypair.publicKey.toString(),
    privateKey: bs58.encode(keypair.secretKey),
  });
}
