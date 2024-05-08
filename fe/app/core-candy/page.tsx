"use client";

import React, { useState } from "react";
import useUmi from "@/hooks/useUmi";
import { create } from "@metaplex-foundation/mpl-core-candy-machine";
import { percentAmount, generateSigner, some } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  TokenStandard,
  createNft,
} from "@metaplex-foundation/mpl-token-metadata";
import axios from "axios";
import { createCollectionV1 } from "@metaplex-foundation/mpl-core";
function UMICreateCandyMachine() {
  const [form, setform] = useState({
    name: "",
    description: "",
    symbol: "",
    sellerFeeBasisPoints: 0,
  });
  const wallet = useWallet();
  const umi = useUmi();
  const [current, setcurrent] = useState<null | any>(null);

  const uploadOffChain = async () => {
    const request = new FormData();
    request.append("image", current);
    request.append(
      "metadata",
      JSON.stringify({
        name: form.name,
        symbol: form.symbol,
        description: form.description,
      })
    );

    const {
      data: { uri },
    } = await axios.post("/api/irys", request);

    return uri;
  };

  const onCreateMint = async () => {
    const collectionSigner = generateSigner(umi);

    await createCollectionV1(umi, {
      collection: collectionSigner,
      name: "My Collection",
      uri: "https://example.com/my-collection.json",
    }).sendAndConfirm(umi, { confirm: { commitment: "finalized" } });
    const candyMachine = generateSigner(umi);

    const createIx = await (
      await create(umi, {
        candyMachine,
        collection: collectionSigner.publicKey,
        collectionUpdateAuthority: umi.identity,
        itemsAvailable: 5000,
        configLineSettings: some({
          prefixName: "Example Asset #",
          nameLength: 15,
          prefixUri: "https://example.com/metadata/",
          uriLength: 29,
          isSequential: false,
        }),
      })
    ).sendAndConfirm(umi);

    console.log(createIx);
  };

  const onInputChange = (e: any) => {
    const { name, value } = e.target;
    setform((state) => ({ ...state, [name]: value }));
  };

  const onFileChange = async (e: any) => {
    setcurrent(e.target.files[0]);
  };

  return (
    <div>
      <div className="flex flex-col col-span-2">
        <p className="text-xs">image</p>
        <input type="file" onChange={onFileChange} className="text-black" />
      </div>
      <div className="flex flex-col">
        <p className="text-xs">name</p>
        <input
          name="name"
          type="text"
          onChange={onInputChange}
          className="text-black"
        />
      </div>
      <div className="flex flex-col">
        <p className="text-xs">symbol</p>
        <input
          name="symbol"
          type="text"
          onChange={onInputChange}
          className="text-black"
        />
      </div>
      <div className="flex flex-col">
        <p className="text-xs">description</p>
        <input
          name="description"
          type="text"
          onChange={onInputChange}
          className="text-black"
        />
      </div>
      <div className="flex flex-col">
        <p className="text-xs">seller fee basis points</p>
        <input
          name="sellerFeeBasisPoints"
          type="number"
          onChange={onInputChange}
          className="text-black"
        />
      </div>

      <button onClick={onCreateMint}>Create Mint</button>
    </div>
  );
}

export default UMICreateCandyMachine;
