"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { WebUploader } from "@irys/web-upload";
import { WebSolana } from "@irys/web-upload-solana";
import { TaggedFile } from "@irys/web-upload/esm/upload";

const getIrysUploader = async (wallet: any) => {
  try {
    const irysUploader = await WebUploader(WebSolana)
      .withProvider(wallet)
      .withRpc(
        process.env.RPC_URL ??
          "https://devnet.helius-rpc.com/?api-key=86841795-5a03-4192-bd44-cbe41117cb77"
      )
      .devnet();

    return irysUploader;
  } catch (error) {
    console.error("Error connecting to Irys:", error);
    throw new Error("Error connecting to Irys");
  }
};

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const wallet = useWallet();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [files, setfiles] = useState<any[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const connectToIrys = async () => {
    if (!wallet) {
      console.log("Wallet not connected");
      return;
    }

    try {
      const irysUploader = await getIrysUploader(wallet);
      console.log(`Connected to Irys from ${irysUploader.address}`);
      setIsConnected(true);
    } catch (error) {
      console.log("Error connecting to Irys");
    }
  };

  const fundAccount = async () => {
    const irysUploader = await getIrysUploader(wallet);
    try {
      const fundTx = await irysUploader.fund(irysUploader.utils.toAtomic(0.05));
      console.log(
        `Successfully funded ${irysUploader.utils.fromAtomic(
          fundTx.quantity
        )} ${irysUploader.token}`
      );
    } catch (e) {
      console.log("Error when funding ", e);
    }
  };

  const setImages = async (event: any) => {
    const temp: File[] = [...event.target.files];

    setfiles(temp);
  };

  const uploadFolder = async () => {
    const irysUploader = await getIrysUploader(wallet);

    const tagged = files.map((f: any) => {
      f.tags = [{ name: "Content-Type", value: "image/png" }];
      return f;
    });

    console.log(tagged);

    try {
      console.log("Ongoing");

      const receipt = await irysUploader.uploadFolder(tagged, {});

      console.log(`Files uploaded. Manifest ID ${receipt.id}`);
    } catch (e) {
      console.log("Error when uploading ", e);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <WalletMultiButton style={{}} />

      {isConnected && <button onClick={fundAccount}>Fund Irys</button>}
      {isConnected && <button onClick={uploadFolder}>Upload Now</button>}
      {isConnected && (
        <input
          type="file"
          // @ts-ignore
          webkitdirectory="true"
          multiple
          onChange={setImages}
        />
      )}

      <button onClick={connectToIrys}>
        {isConnected ? "Connected to Irys" : "Connect Irys"}
      </button>
    </div>
  );
}
