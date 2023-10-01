import { useEffect, useState } from "react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, utils } from "@coral-xyz/anchor";
import { idl } from "./config";
import { useWeb3Store } from "./states";

const programID = new PublicKey(idl.metadata.address);

function App() {
  const { provider, getProvider, connectWallet, wallet } =
    useWeb3Store() as any;

  useEffect(() => {
    getProvider();
  }, []);

  const createPost = async () => {
    const program = new Program(
      JSON.parse(JSON.stringify(idl)),
      programID,
      provider
    );
    const title: string = "Title Test";
    const content: string = "Content Test";
    console.log(provider);

    const [postPDA, _] = PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode("post"), provider.wallet.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .createPost(title, content)
      .accounts({
        post: postPDA,
        signer: provider.wallet.publicKey,
      })
      .rpc();
    const post = await program.account.post.fetch(postPDA);
    console.log(post);
  };

  return (
    <>
      <button onClick={connectWallet}>{wallet}</button>
      <button onClick={createPost}>Add</button>
    </>
  );
}

export default App;
