"use client";
import React from "react";
import Button from "../Button";
import useWeb3 from "@/hooks";

function ConnectButton({}: any) {
  const { wallet, connected, connectWallet, disconnectWallet } = useWeb3();

  const parseWallet = (key: string) => {
    return `${key.slice(0, 5)}.....${key.slice(-5)}`;
  };

  return (
    <>
      <Button
        outlined={!(connected && wallet)}
        onClick={connected && wallet ? disconnectWallet : connectWallet}
      >
        {connected && wallet ? parseWallet(wallet) : "Connect Wallet"}
      </Button>
    </>
  );
}
1;

export default ConnectButton;
