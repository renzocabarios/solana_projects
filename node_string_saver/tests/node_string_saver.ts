import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NodeStringSaver } from "../target/types/node_string_saver";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
describe("node_string_saver", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const program = anchor.workspace.NodeStringSaver as Program<NodeStringSaver>;
  it("Is initialized!", async () => {
    const keyPair = anchor.web3.Keypair.generate();
    const connection = new Connection("http://localhost:8899");
    console.log(await connection.getBalance(keyPair.publicKey));

    await program.methods
      .initialize()
      .accounts({
        stringHolder: keyPair.publicKey,
        user: provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([keyPair])
      .rpc();

    console.log(program.provider.publicKey);

    const accounts = await program.account.stringHolder.all();
    console.log(accounts);
  });
});
