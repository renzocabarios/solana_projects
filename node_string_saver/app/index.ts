import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { NodeStringSaver, IDL } from "../target/types/node_string_saver";
import "dotenv/config";

const connection = new Connection(clusterApiUrl("devnet"));
const program = new Program<NodeStringSaver>(
  IDL,
  new PublicKey("LwLEiVLfLitKwkTSo6rScZspxTF1PfeEX8HBp71LCHE"),
  {
    connection,
  }
);

const start = async () => {
  console.log(await program.account.stringHolder.all());
};

start();
