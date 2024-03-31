import { UMI_INSTANCE } from "./config";
import {
  generateSigner,
  none,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { createTree, mintV1 } from "@metaplex-foundation/mpl-bubblegum";

const main = async () => {
  const maxDepth: number = Number(process.argv[2] ?? 3);
  const maxBufferSize: number = Number(process.argv[3] ?? 8);

  const builder = transactionBuilder();

  const merkleTree = generateSigner(UMI_INSTANCE);

  const createTreeInstruction = await createTree(UMI_INSTANCE, {
    merkleTree,
    maxDepth,
    maxBufferSize,
    public: true,
  });

  const mintV1Instruction = mintV1(UMI_INSTANCE, {
    leafOwner: UMI_INSTANCE.identity.publicKey,
    merkleTree: merkleTree.publicKey,
    metadata: {
      name: "My Compressed NFT",
      uri: "https://example.com/my-cnft.json",
      sellerFeeBasisPoints: 500, // 5%
      collection: none(),
      creators: [
        {
          address: UMI_INSTANCE.identity.publicKey,
          verified: false,
          share: 100,
        },
      ],
    },
  });

  const tx = await builder
    .add(createTreeInstruction)
    .add(mintV1Instruction)
    .sendAndConfirm(UMI_INSTANCE);

  const [signature, _] = base58.deserialize(tx.signature);

  console.log(`Merkle Tree ${merkleTree.publicKey.toString()}`);
  console.log(`TX HASH ${signature}`);
};

main();
