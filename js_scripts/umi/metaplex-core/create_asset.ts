import { UMI_INSTANCE } from "../config";
import { generateSigner } from "@metaplex-foundation/umi";
import { createV1 } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { fetchAssetV1 } from "@metaplex-foundation/mpl-core";
const main = async () => {
  const asset = generateSigner(UMI_INSTANCE);
  const result = await createV1(UMI_INSTANCE, {
    asset: asset,
    name: "My Nft",
    uri: "https://example.com/my-nft",
  }).sendAndConfirm(UMI_INSTANCE, { confirm: { commitment: "finalized" } });

  const [signature, _] = base58.deserialize(result.signature);

  console.log(`SIGNATURE: ${signature}`);

  const fetched = await fetchAssetV1(UMI_INSTANCE, asset.publicKey);

  console.log(fetched);
};

main();
