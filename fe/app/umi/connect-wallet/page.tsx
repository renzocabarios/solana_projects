"use client";

import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import React from "react";
import useUmi from "./useUmi";

function UmiConnectWallet() {
  const umi = useUmi();

  return (
    <div>
      <WalletMultiButton />
      <WalletDisconnectButton />
    </div>
  );
}

export default UmiConnectWallet;
