"use client";
import useMounted from "@/hooks/useMounted";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React from "react";

export default function Navbar() {
  const mounted = useMounted();

  return (
    <div className=" w-full h-[8vh] bg-white flex items-center justify-between px-10 sticky top-0 rounded-lg border-b border-gray-300">
      <p className="text-2xl font-bold">Vaultes 5</p>
      {mounted && <WalletMultiButton style={{}} />}
    </div>
  );
}
