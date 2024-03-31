import { UMI_INSTANCE } from "./config";
import { generateSigner } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";

const main = async () => {
  const merkleTree = generateSigner(UMI_INSTANCE);
  const maxDepth: number = Number(process.argv[2] ?? 3);
  const maxBufferSize: number = Number(process.argv[3] ?? 8);

  const tx = await (
    await createTree(UMI_INSTANCE, {
      merkleTree,
      maxDepth,
      maxBufferSize,
      public: true,
    })
  ).sendAndConfirm(UMI_INSTANCE);

  const [signature, _] = base58.deserialize(tx.signature);

  console.log(`Merkle Tree ${merkleTree.publicKey.toString()}`);
  console.log(`TX HASH ${signature}`);
};

main();
