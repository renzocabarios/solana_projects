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
import { AppBar } from "@/components";
import { Sidenav } from "@/components/sidenav";
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
                  <Sidenav />
                  <div className="flex flex-col">
                    <AppBar />
                    <div className="min-h-[90vh] w-[90vw] p-5">{children}</div>
                  </div>
                </div>
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        )}
      </body>
    </html>
  );
}
