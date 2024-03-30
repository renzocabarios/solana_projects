"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useState } from "react";
import useUmi from "../useUmi";
import { generateSigner } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import { Button, InputField } from "@/components";

function UMICreateNFT() {
  const [form, setform] = useState({
    maxDepth: 0,
    maxBufferSize: 0,
  });

  const umi = useUmi();

  const onCreateMint = async () => {
    const merkleTree = generateSigner(umi);

    const builder = await createTree(umi, {
      merkleTree,
      maxDepth: Number(form.maxDepth),
      maxBufferSize: Number(form.maxBufferSize),
    });

    const tx = await builder.sendAndConfirm(umi);
    const [signature, _] = base58.deserialize(tx.signature);
    alert(`Merkle Tree Address ${merkleTree.publicKey.toString()} `);
    alert(`TX HASH ${signature}`);
  };

  const onInputChange = (e: any) => {
    const { name, value } = e.target;
    setform((state) => ({ ...state, [name]: value }));
  };

  return (
    <div>
      <InputField
        name="maxDepth"
        label="maxDepth"
        type="number"
        onChange={onInputChange}
      />
      <InputField
        name="maxBufferSize"
        label="maxBufferSize"
        type="number"
        onChange={onInputChange}
      />
      <Button onClick={onCreateMint}>Create Merkle Tree</Button>
    </div>
  );
}

export default UMICreateNFT;
