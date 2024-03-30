"use client";

import React, { useState } from "react";
import useUmi from "../useUmi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useWallet } from "@solana/wallet-adapter-react";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { createGenericFileFromBrowserFile } from "@metaplex-foundation/umi";

function UploadJsonIrys() {
  const wallet = useWallet();
  const umi = useUmi();

  const [form, setform] = useState({
    name: "",
    description: "",
    symbol: "",
  });

  const [current, setcurrent] = useState<null | any>(null);

  const onFileChange = async (e: any) => {
    umi.use(walletAdapterIdentity(wallet)).use(irysUploader());
    setcurrent(e.target.files[0]);
    const file = await createGenericFileFromBrowserFile(e.target.files[0]);
    const amount = await umi.uploader.getUploadPrice([file]);
    alert(Number(amount.basisPoints) / 10 ** amount.decimals);
  };

  const onUpload = async (e: any) => {
    umi.use(walletAdapterIdentity(wallet)).use(irysUploader());
    const file = await createGenericFileFromBrowserFile(current);
    const [imageUri] = await umi.uploader.upload([file]);
    const response = await umi.uploader.uploadJson({
      name: form.name,
      symbol: form.symbol,
      description: form.description,
      image: imageUri,
    });
    alert(response);
  };

  const onInputChange = (e: any) => {
    const { name, value } = e.target;
    setform((state) => ({ ...state, [name]: value }));
  };

  return (
    <div>
      <div className="flex flex-col">
        <p>Image</p>
        <input type="file" onChange={onFileChange} className="text-black" />
      </div>
      <div className="flex flex-col">
        <p>name</p>
        <input
          name="name"
          type="text"
          onChange={onInputChange}
          className="text-black"
        />
      </div>

      <div className="flex flex-col">
        <p>symbol</p>
        <input
          name="symbol"
          type="text"
          onChange={onInputChange}
          className="text-black"
        />
      </div>

      <div className="flex flex-col">
        <p>description</p>
        <input
          name="description"
          type="text"
          onChange={onInputChange}
          className="text-black"
        />
      </div>
      <button onClick={onUpload}>Upload metadata</button>
    </div>
  );
}

export default UploadJsonIrys;
