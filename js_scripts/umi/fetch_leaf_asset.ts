import { UMI_INSTANCE } from "./config";
import {
  generateSigner,
  none,
  publicKey,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import {
  LeafSchema,
  createTree,
  findLeafAssetIdPda,
  mintV1,
  parseLeafFromMintV1Transaction,
} from "@metaplex-foundation/mpl-bubblegum";

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
      uri: "https://arweave.net/MKcyRKqEzjlLs9-gM4eZAnrw3wkHjtmM1UohfbRqkYE",
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

  const tx1 = await builder
    .add(createTreeInstruction)
    .sendAndConfirm(UMI_INSTANCE, { confirm: { commitment: "finalized" } });

  const { signature } = await builder
    .add(mintV1Instruction)
    .sendAndConfirm(UMI_INSTANCE, { confirm: { commitment: "finalized" } });

  const leaf: LeafSchema = await parseLeafFromMintV1Transaction(
    UMI_INSTANCE,
    signature
  );

  const assetId = findLeafAssetIdPda(UMI_INSTANCE, {
    merkleTree: publicKey(merkleTree),
    leafIndex: leaf.nonce,
  });

  console.log(`Leaf Creator Hash ${leaf.creatorHash}`);
  console.log(`Leaf Data Hash ${leaf.dataHash}`);
  console.log(`Leaf Delegate ${leaf.delegate}`);
  console.log(`Leaf ID ${leaf.id}`);
  console.log(`Leaf Owner ${leaf.owner}`);
  console.log(`Leaf Nonce ${leaf.nonce}`);
  console.log(`Leaf Asset ID PDA ${assetId}`);
};

main();
