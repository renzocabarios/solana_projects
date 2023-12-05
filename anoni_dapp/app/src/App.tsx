import { PublicKey } from "@solana/web3.js";
import { useWeb3Store } from "./states";
import { getProgramInstance, PROVIDER } from "./config";
import { createPost } from "./instructions";
import { IWeb3Store } from "./interfaces";
import { useEffect, useState } from "react";

function App() {
  const { posts, getPosts, setWallet, wallet } = useWeb3Store() as IWeb3Store;
  const [form, setform] = useState({ title: "", content: "" })

  const create = async () => {

    if (PROVIDER && wallet) {
      const program = getProgramInstance(PROVIDER);
      await createPost(program, new PublicKey(wallet), form);
      await getPosts(PROVIDER);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setform((state: any) => ({ ...state, [name]: value }))
  };

  useEffect(() => {
    const get = async () => {
      await getPosts(PROVIDER);
    };

    get();
  }, []);

  return (
    <>
      <button onClick={setWallet} className="p-2 bg-slate-500">{wallet}</button>
      <div className="flex flex-col gap-5 p-5">

        <div className="flex flex-col gap-2">
          <p>Title</p>
          <input type="text" name="title" onChange={handleChange} className="bg-slate-200" />
        </div>

        <div className="flex flex-col gap-2">
          <p>Content</p>
          <input type="text" name="content" onChange={handleChange} className="bg-slate-200" />
        </div>

        <button onClick={create} className="p-2 bg-slate-500">Create</button>
      </div>

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
