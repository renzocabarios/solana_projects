"use client";
import "../globals.css";
import { Sidenav } from "@/components/sidenav";
import Providers from "@/components/providers";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import AppBar from "@/components/app-bar";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function Root({
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
        <Toaster />

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
