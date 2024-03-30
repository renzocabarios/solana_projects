"use client";

import React, { useState } from "react";
import useUmi from "../useUmi";
import { percentAmount, generateSigner } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { createFungible } from "@metaplex-foundation/mpl-token-metadata";

function UMICreateFungibleToken() {
  const [form, setform] = useState({ name: "", sellerFeeBasisPoints: 0 });
  const umi = useUmi();

  const onCreateMint = async () => {
    const mint = generateSigner(umi);

    const tx = await createFungible(umi, {
      mint,
      name: form.name,
      // TODO: Create URI upload for this
      uri: "https://example.com/my-fungible.json",
      sellerFeeBasisPoints: percentAmount(form.sellerFeeBasisPoints),
    }).sendAndConfirm(umi);

    const [signature, _] = base58.deserialize(tx.signature);
    alert(`Created Token ${mint.publicKey.toString()} `);
    alert(`TX HASH ${signature}`);
  };

  const onHandleChange = (e: any) => {
    const { name, value } = e.target;
    setform((state) => ({ ...state, [name]: value }));
  };

  return (
    <div>
      <div className="flex flex-col">
        <p>Name</p>
        <input
          name="name"
          type="text"
          onChange={onHandleChange}
          className="text-black"
        />
      </div>

      <div className="flex flex-col">
        <p>Seller Fee Basis Points</p>
        <input
          name="sellerFeeBasisPoints"
          type="number"
          onChange={onHandleChange}
          className="text-black"
        />
      </div>
      <button onClick={onCreateMint}>Create Mint</button>
    </div>
  );
}

export default UMICreateFungibleToken;
