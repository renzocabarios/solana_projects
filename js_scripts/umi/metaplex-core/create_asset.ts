import { UMI_INSTANCE } from "../config";
import { generateSigner } from "@metaplex-foundation/umi";
import { createV1 } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";

const main = async () => {
  const asset = generateSigner(UMI_INSTANCE);
  const result = await createV1(UMI_INSTANCE, {
    asset: asset,
    name: "My Nft",
    uri: "https://example.com/my-nft",
  }).sendAndConfirm(UMI_INSTANCE);

  const [signature, _] = base58.deserialize(result.signature);
  console.log(signature);
};

main();
