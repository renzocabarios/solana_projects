import { UMI_INSTANCE } from "./config";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import {
  createNft,
  printSupply,
} from "@metaplex-foundation/mpl-token-metadata";

const main = async () => {
  const mint = generateSigner(UMI_INSTANCE);

  await createNft(UMI_INSTANCE, {
    mint,
    name: "My Master Edition NFT",
    symbol: "MMNFT",
    uri: "https://arweave.net/MKcyRKqEzjlLs9-gM4eZAnrw3wkHjtmM1UohfbRqkYE",
    sellerFeeBasisPoints: percentAmount(5.5),
    printSupply: printSupply("Limited", [100]), // Or printSupply('Unlimited')
  }).sendAndConfirm(UMI_INSTANCE);

  console.log(`Master NFT Mint ID: ${mint.publicKey.toString()}`);
};

main();
