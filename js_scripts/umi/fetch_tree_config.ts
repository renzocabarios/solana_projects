import { UMI_INSTANCE } from "./config";
import { publicKey } from "@metaplex-foundation/umi";
import { fetchTreeConfigFromSeeds } from "@metaplex-foundation/mpl-bubblegum";

const main = async () => {
  const merkleTree = publicKey(process.argv[2] ?? "");

  const treeConfig = await fetchTreeConfigFromSeeds(UMI_INSTANCE, {
    merkleTree,
  });

  console.log(`Public Key: ${treeConfig.publicKey}`);
  console.log(`Tree Creator: ${treeConfig.treeCreator}`);
  console.log(`Tree Delegate: ${treeConfig.treeDelegate}`);
  console.log(`Total Mint Capacity: ${treeConfig.totalMintCapacity}`);
  console.log(`Number Minted: ${treeConfig.numMinted}`);
  console.log(`Is Public: ${treeConfig.isPublic}`);
  console.log(`Is Decompressible: ${treeConfig.isDecompressible}`);
};

main();
