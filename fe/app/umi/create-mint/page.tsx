"use client";

import React, { useState } from "react";
import useUmi from "../useUmi";
import { generateSigner } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { createMint } from "@metaplex-foundation/mpl-toolbox";

function UMICreateMint() {
  const [decimals, setdecimals] = useState(0);
  const umi = useUmi();

  const onCreateMint = async () => {
    const mint = generateSigner(umi);
    const tx = await createMint(umi, {
      mint,
      decimals,
      mintAuthority: umi.identity.publicKey,
      freezeAuthority: umi.identity.publicKey,
    }).sendAndConfirm(umi);

    const [signature, _] = base58.deserialize(tx.signature);

    alert(
      `Created Token ${mint.publicKey.toString()} with ${decimals} decimals`
    );

    alert(`TX HASH ${signature}`);
  };

  const onHandleChange = (e: any) => {
    setdecimals(e.target.value);
  };

  return (
    <div>
      <div className="flex flex-col">
        <p>Decimals</p>
        <input type="number" onChange={onHandleChange} className="text-black" />
      </div>
      <button onClick={onCreateMint}>Create Mint</button>
    </div>
  );
}

export default UMICreateMint;
