"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useState } from "react";

export default function Navbar() {
  const [mounted, setmounted] = useState(false);

  useEffect(() => {
    setmounted(true);
  }, []);

  return (
    <div className="sticky top-0 flex items-center px-4 bg-white h-[8vh]">
      {mounted && <WalletMultiButton />}
    </div>
  );
}
