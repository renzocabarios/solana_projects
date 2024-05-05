import { UMI_INSTANCE } from "./config";
import { publicKey } from "@metaplex-foundation/umi";
import { fetchMerkleTree } from "@metaplex-foundation/mpl-bubblegum";

const main = async () => {
  const merkleTree = publicKey(process.argv[2] ?? "");
  const merkleTreeAccount = await fetchMerkleTree(UMI_INSTANCE, merkleTree);

  console.log(merkleTreeAccount);
};

main();
