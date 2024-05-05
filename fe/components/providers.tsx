"use client";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SOLANA } from "@/config";
import { useState, useEffect } from "react";

require("@solana/wallet-adapter-react-ui/styles.css");

function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setmounted] = useState(false);
  useEffect(() => {
    setmounted(true);
  }, []);

  if (!mounted) {
    return <></>;
  }

  return (
    <ConnectionProvider endpoint={SOLANA.rpc}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default Providers;
