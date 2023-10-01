import { clusterApiUrl, Connection } from "@solana/web3.js";

const CONNECTION: Connection = new Connection(
  clusterApiUrl("devnet"),
  "processed"
);

export { CONNECTION };
