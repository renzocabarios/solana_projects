import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));
// https://arweave.net/jgqEvcijKnempqMLmE3BV3wH25VNQpVwdHi5bcVZDRA

(async () => {
  try {
    const image =
      "https://arweave.net/jgqEvcijKnempqMLmE3BV3wH25VNQpVwdHi5bcVZDRA";
    const metadata = {
      name: "Image",
      symbol: "IMG",
      description: "A simple description",
      image,
      attributes: [{ trait_type: "Simplicity Level", value: "100" }],
      properties: {
        files: [
          {
            type: "image/jpeg",
            uri: image,
          },
        ],
      },
      creators: [],
    };
    const myUri = await umi.uploader.uploadJson(metadata);
    console.log("Your metadata URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
