"use client";

import React, { useState } from "react";
import useUmi from "../useUmi";
import { generateSigner, transactionBuilder } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import { Button, InputField } from "@/components";
import { none } from "@metaplex-foundation/umi";
import { mintV1 } from "@metaplex-foundation/mpl-bubblegum";

function UMICreateCNFT() {
  const [form, setform] = useState({
    maxDepth: 3,
    maxBufferSize: 8,
  });

  const umi = useUmi();

  const onCreateMint = async () => {
    const merkleTree = generateSigner(umi);

    const createTreeInstruction = await createTree(umi, {
      merkleTree,
      maxDepth: Number(form.maxDepth),
      maxBufferSize: Number(form.maxBufferSize),
    });

    const mintV1Instruction = await mintV1(umi, {
      leafOwner: umi.identity.publicKey,
      merkleTree: merkleTree.publicKey,
      metadata: {
        name: "My Compressed NFT",
        uri: "https://arweave.net/ltsr9ACRVPckNdxJrk0DV5kkZw3bF_aisy3Yt519Iak",
        sellerFeeBasisPoints: 500, // 5%
        collection: none(),
        creators: [
          { address: umi.identity.publicKey, verified: false, share: 100 },
        ],
      },
    });

    const builder = transactionBuilder()
      .add(createTreeInstruction)
      .add(mintV1Instruction);

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

export default UMICreateCNFT;
