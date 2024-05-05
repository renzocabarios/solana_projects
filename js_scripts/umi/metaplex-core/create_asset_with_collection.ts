import { UMI_INSTANCE } from "../config";
import { generateSigner } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { createCollectionV1, createV1 } from "@metaplex-foundation/mpl-core";

const main = async () => {
  const asset = generateSigner(UMI_INSTANCE);
  const collection = generateSigner(UMI_INSTANCE);
  const tx1 = await createCollectionV1(UMI_INSTANCE, {
    collection: collection,
    name: "My NFT",
    uri: "https://example.com/my-nft.json",
  }).sendAndConfirm(UMI_INSTANCE);

  const tx2 = await createV1(UMI_INSTANCE, {
    asset: asset,
    name: "My Nft",
    uri: "https://example.com/my-nft",
  }).sendAndConfirm(UMI_INSTANCE);

  const tx1Hash = base58.deserialize(tx1.signature);
  console.log(tx1Hash[0]);

  const tx2Hash = base58.deserialize(tx2.signature);
  console.log(tx2Hash[0]);
};

main();
