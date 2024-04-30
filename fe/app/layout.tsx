"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppBar } from "@/components";
import { Sidenav } from "@/components/sidenav";
import Providers from "@/components/providers";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
          <div className="flex">
            <Sidenav />
            <div className="flex flex-col">
              <AppBar />
              <div className="min-h-[90vh] w-[90vw] p-5">{children}</div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
