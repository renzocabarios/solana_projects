import { UMI_INSTANCE } from "../config";
import { generateSigner, publicKey } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import {
  createCollectionV1,
  createPlugin,
  createV1,
  ruleSet,
} from "@metaplex-foundation/mpl-core";

const main = async () => {
  const asset = generateSigner(UMI_INSTANCE);
  const creator1 = generateSigner(UMI_INSTANCE);
  const creator2 = generateSigner(UMI_INSTANCE);

  const tx = await createV1(UMI_INSTANCE, {
    asset: asset,
    name: "My Nft",
    uri: "https://example.com/my-nft",
    plugins: [
      {
        plugin: createPlugin({
          type: "Royalties",
          data: {
            basisPoints: 500,
            creators: [
              {
                address: creator1.publicKey,
                percentage: 20,
              },
              {
                address: creator2.publicKey,
                percentage: 80,
              },
            ],
            ruleSet: ruleSet("None"), // Compatibility rule set
          },
        }),
        authority: null,
      },
    ],
  }).sendAndConfirm(UMI_INSTANCE);
  const [signature, _] = base58.deserialize(tx.signature);
  console.log(signature);
};

main();
