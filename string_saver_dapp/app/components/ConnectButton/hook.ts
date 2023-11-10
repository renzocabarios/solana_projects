"use client";
import {
  PublicKey,
  Transaction,
  VersionedTransaction,
  SendOptions,
} from "@solana/web3.js";
import { useEffect, useState } from "react";

type DisplayEncoding = "utf8" | "hex";

type PhantomEvent = "connect" | "disconnect" | "accountChanged";

type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signAndSendTransaction"
  | "signAndSendTransactionV0"
  | "signAndSendTransactionV0WithLookupTable"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

export interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signAndSendTransaction: (
    transaction: Transaction | VersionedTransaction,
    opts?: SendOptions
  ) => Promise<{ signature: string; publicKey: PublicKey }>;
  signTransaction: (
    transaction: Transaction | VersionedTransaction
  ) => Promise<Transaction | VersionedTransaction>;
  signAllTransactions: (
    transactions: (Transaction | VersionedTransaction)[]
  ) => Promise<(Transaction | VersionedTransaction)[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

export type Status = "success" | "warning" | "error" | "info";

export interface TLog {
  status: Status;
  method?: PhantomRequestMethod | Extract<PhantomEvent, "accountChanged">;
  message: string;
  messageTwo?: string;
}

export default function useWeb3() {
  const [connected, setConnected] = useState<boolean>(false);
  const [wallet, setWallet] = useState<string | null>(null);
  const [provider, setprovider] = useState<PhantomProvider | null>(null);

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
    const start = async () => {
      const { solana, phantom } = window as any;
      if (solana) {
        const account = await solana.connect();
        setWallet(account.publicKey.toString());
        setConnected(true);

        setprovider(phantom.solana);
      }
    };
    start();
  }, []);

  return { connectWallet, connected, wallet, disconnectWallet, provider };
}
