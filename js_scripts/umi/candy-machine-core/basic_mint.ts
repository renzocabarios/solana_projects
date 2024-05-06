import { UMI_INSTANCE } from "../config";
import { dateTime, generateSigner, some } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { createCollectionV1 } from "@metaplex-foundation/mpl-core";
import {
  addConfigLines,
  create,
  fetchCandyMachine,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { transactionBuilder } from "@metaplex-foundation/umi";
import { mintV1 } from "@metaplex-foundation/mpl-core-candy-machine";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";

const main = async () => {
  const candyMachine = generateSigner(UMI_INSTANCE);
  const collection = generateSigner(UMI_INSTANCE);

  const tx1 = await createCollectionV1(UMI_INSTANCE, {
    collection: collection,
    name: "My NFT",
    uri: "https://example.com/my-nft.json",
  }).sendAndConfirm(UMI_INSTANCE, { confirm: { commitment: "finalized" } });

  const tx2 = await (
    await create(UMI_INSTANCE, {
      candyMachine,
      collection: collection.publicKey,
      collectionUpdateAuthority: UMI_INSTANCE.identity,
      itemsAvailable: 2,
      configLineSettings: some({
        prefixName: "Example Asset #",
        nameLength: 15,
        prefixUri: "https://example.com/metadata/",
        uriLength: 29,
        isSequential: false,
      }),
      guards: {
        startDate: some({ date: dateTime(new Date()) }),
      },
    })
  ).sendAndConfirm(UMI_INSTANCE, { confirm: { commitment: "finalized" } });

  const tx1Hash = base58.deserialize(tx1.signature);
  console.log(tx1Hash[0]);

  const tx2Hash = base58.deserialize(tx2.signature);
  console.log(tx2Hash[0]);

  const fetched = await fetchCandyMachine(UMI_INSTANCE, candyMachine.publicKey);
  console.log(fetched);

  const tx3 = await addConfigLines(UMI_INSTANCE, {
    candyMachine: candyMachine.publicKey,
    index: fetched.itemsLoaded,
    configLines: [
      { name: "My NFT #1", uri: "https://example.com/nft1.json" },
      { name: "My NFT #2", uri: "https://example.com/nft2.json" },
    ],
  }).sendAndConfirm(UMI_INSTANCE, { confirm: { commitment: "finalized" } });

  const tx3Hash = base58.deserialize(tx3.signature);
  console.log(tx3Hash[0]);

  const updated = await fetchCandyMachine(UMI_INSTANCE, candyMachine.publicKey);
  console.log(updated);

  const asset = generateSigner(UMI_INSTANCE);

  const tx4 = await transactionBuilder()
    .add(setComputeUnitLimit(UMI_INSTANCE, { units: 800_000 }))

    .add(
      mintV1(UMI_INSTANCE, {
        candyMachine: candyMachine.publicKey,
        asset,
        collection: updated.collectionMint,
      })
    )
    .sendAndConfirm(UMI_INSTANCE, { confirm: { commitment: "finalized" } });

  const tx4Hash = base58.deserialize(tx4.signature);
  console.log(tx4Hash[0]);
};

main();
