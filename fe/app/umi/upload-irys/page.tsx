"use client";

import React from "react";
import useUmi from "../useUmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { createGenericFileFromBrowserFile } from "@metaplex-foundation/umi";

function UMIUploadIrys() {
  const umi = useUmi();

  const onUpload = async (e: any) => {
    const file = await createGenericFileFromBrowserFile(e.target.files[0]);
    const amount = await umi.uploader.getUploadPrice([file]);
    alert(Number(amount.basisPoints) / 10 ** amount.decimals);

    const [imageUri] = await umi.uploader.upload([file]);
    console.log(imageUri);
  };

  return (
    <div>
      <div className="flex flex-col">
        <p>Image</p>
        <input type="file" onChange={onUpload} className="text-black" />
      </div>
    </div>
  );
}

export default UMIUploadIrys;
