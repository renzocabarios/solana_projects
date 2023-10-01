import { PublicKey } from "@solana/web3.js";
import { useWeb3Store } from "./states";
import { getProgramInstance, PROVIDER } from "./config";
import { createPost } from "./instructions";
import { IWeb3Store } from "./interfaces";
import { useEffect } from "react";

function App() {
  const { posts, getPosts, setWallet, wallet } = useWeb3Store() as IWeb3Store;

  const create = async () => {
    if (PROVIDER && wallet) {
      const program = getProgramInstance(PROVIDER);
      await createPost(program, new PublicKey(wallet), "Test", "test");
      await getPosts(PROVIDER);
    }
  };

  useEffect(() => {
    const get = async () => {
      await getPosts(PROVIDER);
    };

    get();
  }, []);

  return (
    <>
      <button onClick={setWallet}>{wallet}</button>
      <button onClick={create}>Create</button>
      {posts.map((e: any) => {
        return (
          <div key={e.publicKey.toString()}>
            <p>Creator: {e.account.creator.toString()}</p>
            <p>Title: {e.account.title}</p>
            <p>Content: {e.account.content}</p>
          </div>
        );
      })}
    </>
  );
}

export default App;
