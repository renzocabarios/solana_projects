"use client";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";

export default function useWeb3() {
  const [connected, setConnected] = useState<boolean>(false);
  const [wallet, setWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);

  const connectWallet = async () => {
    const { solana } = window as any;
    const account = await solana.connect();
    setWallet(account.publicKey.toString());
    setConnected(true);
  };

  const disconnectWallet = async () => {
    setConnected(false);
    setWallet(null);
  };

  useEffect(() => {
    const connection = new Connection("https://api.devnet.solana.com");
    const start = async () => {
      const { solana } = window as any;
      const account = await solana.connect();
      setWallet(account.publicKey.toString());
      setBalance(
        (await connection.getBalance(account.publicKey)) / LAMPORTS_PER_SOL
      );
      setConnected(true);
    };
    start();
  }, []);

  return { connectWallet, connected, wallet, disconnectWallet, balance };
}
