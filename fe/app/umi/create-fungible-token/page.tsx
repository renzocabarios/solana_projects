"use client";

import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import React, { useState } from "react";
import useUmi from "../useUmi";
import { percentAmount, generateSigner } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useWallet } from "@solana/wallet-adapter-react";
import { createFungible } from "@metaplex-foundation/mpl-token-metadata";

function CreateFungibleToken() {
  const [form, setform] = useState({ name: "", sellerFeeBasisPoints: 0 });
  const wallet = useWallet();
  const umi = useUmi();

  const onCreateMint = async () => {
    umi.use(walletAdapterIdentity(wallet)).use(mplToolbox());

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
      <WalletMultiButton />
      <WalletDisconnectButton />

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

export default CreateFungibleToken;
