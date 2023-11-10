import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, setProvider, web3, AnchorProvider } from "@coral-xyz/anchor";
import { NodeStringSaver, IDL } from "../target/types/node_string_saver";
import "dotenv/config";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

const connection = new Connection(clusterApiUrl("devnet"));
const program = new Program<NodeStringSaver>(
  IDL,
  new PublicKey("LwLEiVLfLitKwkTSo6rScZspxTF1PfeEX8HBp71LCHE"),
  {
    connection,
  }
);
const keyPair
const wallet = new NodeWallet(new Keypair());

const start = async () => {
  const myAccount = anchor.web3.Keypair.generate();
  await program.methods
    .initialize("Users")
    .accounts({
      stringHolder: myAccount.publicKey,
      signer: provider.wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([myAccount])
    .rpc();
  console.log(await program.account.stringHolder.all());
};

start();
