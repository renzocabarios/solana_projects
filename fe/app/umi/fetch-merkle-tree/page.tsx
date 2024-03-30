"use client";
import React, { useState } from "react";
import useUmi from "../useUmi";
import { publicKey } from "@metaplex-foundation/umi";
import {
  TreeConfig,
  fetchTreeConfigFromSeeds,
} from "@metaplex-foundation/mpl-bubblegum";
import { Button, InputField } from "@/components";

function UMIFetchMerkleTree() {
  const [form, setform] = useState({
    merkleTree: "",
  });

  const [treeConfig, settreeConfig] = useState<null | TreeConfig>();

  const umi = useUmi();

  const onCreateMint = async () => {
    const treeConfig = await fetchTreeConfigFromSeeds(umi, {
      merkleTree: publicKey(form.merkleTree),
    });

    settreeConfig(treeConfig);
  };

  const onInputChange = (e: any) => {
    const { name, value } = e.target;
    setform((state) => ({ ...state, [name]: value }));
  };

  return (
    <div>
      <InputField
        name="merkleTree"
        label="merkleTree"
        type="text"
        onChange={onInputChange}
      />
      <Button onClick={onCreateMint}>Fetch Merkle Tree</Button>

      {treeConfig && (
        <>
          <p>{`Is Public: ${treeConfig.isPublic}`}</p>
          <p>{`Public Key: ${treeConfig.publicKey.toString()}`}</p>
          <p>{`Tree Creator: ${treeConfig.treeCreator.toString()}`}</p>
          <p>{`Tree Delegate: ${treeConfig.treeDelegate.toString()}`}</p>
          <p>{`Is Decompressible: ${treeConfig.isDecompressible}`}</p>
          <p>{`Number of minted: ${treeConfig.numMinted}`}</p>
          <p>{`Mint Capacity: ${treeConfig.totalMintCapacity}`}</p>
        </>
      )}
    </div>
  );
}

export default UMIFetchMerkleTree;
