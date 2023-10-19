"use client"
import React, { useEffect, useState } from "react";
import Button from "../Button";
import { useSolana } from "@/hooks";

function ConnectWallet({ }: any) {
  const { wallet, connectWallet } = useSolana();

  return (
    <>
      <Button onClick={connectWallet}>{wallet ? `${wallet.slice(0, 5)}.....${wallet.slice(-5)}` : "Connect Wallet"}</Button>
    </>
  );
}

export default ConnectWallet;
