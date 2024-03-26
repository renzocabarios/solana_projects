"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SOLANA } from "@/config";
import Link from "next/link";
require("@solana/wallet-adapter-react-ui/styles.css");
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [rendered, setrendered] = useState(false);

  useEffect(() => {
    setrendered(true);
  }, [setrendered]);

  return (
    <html lang="en">
      <body className={inter.className}>
        {rendered && (
          <ConnectionProvider endpoint={SOLANA.rpc}>
            <WalletProvider wallets={[]} autoConnect>
              <WalletModalProvider>
                <div className="flex">
                  <div className="flex flex-col p-2 gap-2 min-h-screen bg-slate-900 w-[10vw]">
                    <Link href={"/connect-wallet"}>Connect Wallet</Link>
                    <Link href={"/umi/connect-wallet"}>UMI Connect Wallet</Link>
                    <Link href={"/umi/create-mint"}>UMI Create Mint</Link>
                  </div>
                  <div className="min-h-screen w-[90vw]">{children}</div>
                </div>
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        )}
      </body>
    </html>
  );
}
