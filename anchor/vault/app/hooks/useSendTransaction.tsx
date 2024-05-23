import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";

export default function useSendTransaction() {
  const { sendTransaction } = useWallet();
  const { connection } = useConnection();

  const handleSendTransaction = async (tx: Transaction) => {
    console.log(await sendTransaction(tx, connection));
  };

  return { handleSendTransaction };
}
