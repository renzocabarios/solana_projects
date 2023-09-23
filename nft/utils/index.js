import {
  METAPLEX_INSTANCE,
  getKeypairIdentity,
  ACCOUNT,
  CONNECTION,
} from "../config/index.js";
import { toMetaplexFile } from "@metaplex-foundation/js";
import fs from "fs";

export const metaplex = METAPLEX_INSTANCE(
  CONNECTION,
  getKeypairIdentity(ACCOUNT)
);

export async function uploadFile(uri) {
  const buffer = fs.readFileSync(uri);
  const file = toMetaplexFile(buffer, "image.jpg");
  return await metaplex.storage().upload(file);
}

export async function uploadNFT(imageURI) {
  const metadata = {
    name: "renzo.sol.NFT",
    description: "Santa's alter ego",
    image: imageURI,
    symbol: "NOOB",
    attributes: [
      {
        trait_type: "Event",
        value: "Solana Developers Bootcamp",
      },
    ],
  };
  const { uri } = await metaplex.nfts().uploadMetadata(metadata);
  return uri;
}

export async function createNFT(metadataURI) {
  const {
    nft: { address },
  } = await metaplex.nfts().create({
    uri: metadataURI,
    name: "Fake Santa",
    sellerFeeBasisPoints: 0,
  });

  return address.toString();
}
