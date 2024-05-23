"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useState } from "react";

export default function WriteButton({ children }: any) {
  const { connecting, connected, disconnecting } = useWallet();
  const [mounted, setmounted] = useState(false);

  useEffect(() => {
    setmounted(true);
  }, []);

  if (!connected) {
    return mounted && <WalletMultiButton style={{}} />;
  }

  return <>{children}</>;
}
