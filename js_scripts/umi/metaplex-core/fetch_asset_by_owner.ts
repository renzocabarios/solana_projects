import { UMI_INSTANCE } from "../config";
import { publicKey } from "@metaplex-foundation/umi";
import { Key, getAssetV1GpaBuilder } from "@metaplex-foundation/mpl-core";

const main = async () => {
  const assetsByOwner = await getAssetV1GpaBuilder(UMI_INSTANCE)
    .whereField("key", Key.AssetV1)
    .whereField(
      "owner",
      publicKey("EzhM1Anf8sNxMPJwSVdUf5SCtULkhpKDuzWxocBsF2cA")
    )
    .getDeserialized();

  console.log(assetsByOwner);
};

main();
