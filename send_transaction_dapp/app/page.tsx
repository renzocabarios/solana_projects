"use client";
import { Navbar } from "@/components";
import useWeb3 from "@/components/ConnectButton/hook";
import {
  SystemProgram,
  PublicKey,
  Connection,
  clusterApiUrl,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { useState } from "react";

export default function Home() {
  const [publicKey, setpublicKey] = useState("");
  const { wallet, provider } = useWeb3();

  const changeHandler = (e: any) => {
    setpublicKey(e.target.value);
  };

  const getLatestBlockhash = async () => {
    const connection = new Connection(clusterApiUrl("devnet"));
    return (await connection.getLatestBlockhash("finalized")).blockhash;
  };

  const send = async () => {
    const instructions = [
      SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet ?? ""),
        toPubkey: new PublicKey(publicKey),
        lamports: 1,
      }),
    ];

    const messageV0 = new TransactionMessage({
      payerKey: new PublicKey(wallet ?? ""),
      recentBlockhash: await getLatestBlockhash(),
      instructions,
    }).compileToV0Message();

    const transactionV0 = new VersionedTransaction(messageV0);

    if (provider) {
      const signature = await provider.signAndSendTransaction(transactionV0);
      console.log(signature);
    }
  };

  return (
    <main>
      <Navbar />

      <input type="text" onChange={changeHandler} />

      <button onClick={send}> Send 1 SOL</button>
    </main>
  );
}
