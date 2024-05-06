import { UMI_INSTANCE } from "../config";
import { dateTime, generateSigner, some } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { createCollectionV1 } from "@metaplex-foundation/mpl-core";
import { create } from "@metaplex-foundation/mpl-core-candy-machine";

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
      itemsAvailable: 5000,
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
};

main();
