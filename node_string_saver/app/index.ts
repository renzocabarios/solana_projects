import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet.js";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import bs58 from "bs58";
import { IDL, NodeStringSaver } from "../target/types/node_string_saver";

const connection = new Connection(clusterApiUrl("devnet"));

const keypair = Keypair.fromSecretKey(bs58.decode("inserthere"));

const wallet = new NodeWallet(keypair);

const provider = new AnchorProvider(connection, wallet, {
  commitment: "processed",
});

const program = new Program<NodeStringSaver>(
  IDL,
  new PublicKey("4BURzfAxaZbwk8HwBmbo3U7yQYu4Zok9bttGuXjkkWvq"),
  provider
);

const start = async () => {
  const stringHolder = Keypair.generate();
  await program.methods
    .initialize()
    .accounts({
      stringHolder: stringHolder.publicKey,
      user: provider.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([stringHolder])
    .rpc();

  await program.methods
    .add("asd")
    .accounts({
      stringHolder: stringHolder.publicKey,
    })
    .rpc();

  const accounts = await program.account.stringHolder.all();
  console.log(accounts);
};

start();
