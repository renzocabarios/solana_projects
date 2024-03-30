"use client";

import React, { useState } from "react";
import useUmi from "../useUmi";
import { percentAmount, generateSigner, some } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  TokenStandard,
  createNft,
} from "@metaplex-foundation/mpl-token-metadata";
import axios from "axios";
import {
  create,
  mplCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";

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
    umi
      .use(walletAdapterIdentity(wallet))
      .use(mplToolbox())
      .use(mplCandyMachine());
    const uri = await uploadOffChain();
    const collectionMint = generateSigner(umi);
    const candyMachine = generateSigner(umi);

    const tx = await createNft(umi, {
      mint: collectionMint,
      name: form.name,
      symbol: form.symbol,
      uri,
      sellerFeeBasisPoints: percentAmount(form.sellerFeeBasisPoints),
      isCollection: true,
    })
      .add(
        await create(umi, {
          candyMachine,
          collectionMint: collectionMint.publicKey,
          collectionUpdateAuthority: umi.identity,
          tokenStandard: TokenStandard.NonFungible,
          sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
          itemsAvailable: 5000,
          creators: [
            {
              address: umi.identity.publicKey,
              verified: true,
              percentageShare: 100,
            },
          ],
          configLineSettings: some({
            prefixName: "",
            nameLength: 32,
            prefixUri: "",
            uriLength: 200,
            isSequential: false,
          }),
        })
      )
      .sendAndConfirm(umi);

    const [signature, _] = base58.deserialize(tx.signature);
    alert(`Created Collection Mint ${collectionMint.publicKey.toString()} `);
    alert(`Created Candy Machine ${candyMachine.publicKey.toString()} `);
    alert(`TX HASH ${signature}`);
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
