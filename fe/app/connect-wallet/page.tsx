"use client";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import React from "react";

function ConnectWallet() {
  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />
    </div>
  );
}

export default ConnectWallet;
