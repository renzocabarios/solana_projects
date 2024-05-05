import { UMI_INSTANCE } from "../config";
import { generateSigner } from "@metaplex-foundation/umi";
import {
  createV1,
  updateAuthority,
  updateV1,
} from "@metaplex-foundation/mpl-core";
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

  // TODO: Not working
  const tx1 = await updateV1(UMI_INSTANCE, {
    asset: asset.publicKey,
    newUpdateAuthority: updateAuthority("None"),
    newName: "New Nft Name",
    newUri: "https://example.com/new-uri",
  }).sendAndConfirm(UMI_INSTANCE, { confirm: { commitment: "finalized" } });

  const tx1Hash = base58.deserialize(tx1.signature);
  console.log(`SIGNATURE: ${tx1Hash[0]}`);

  const updated = await fetchAssetV1(UMI_INSTANCE, asset.publicKey);
  console.log(updated);
};

main();
