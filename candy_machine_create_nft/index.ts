import {
  createNft,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { create } from "@metaplex-foundation/mpl-candy-machine";
import {
  createSignerFromKeypair,
  generateSigner,
  keypairIdentity,
  percentAmount,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { clusterApiUrl, Keypair } from "@solana/web3.js";
import base58 from "bs58";

// Use the RPC endpoint of your choice.

const umi = createUmi(clusterApiUrl("devnet")).use(mplCandyMachine());
const keypair = umi.eddsa.createKeypairFromSecretKey(
  base58.decode(
    "3e4Ve7ofQxXCLqR9iRrEXQQRJLUNKJG9FxQQdAuhzdSZy8A2QJawqQTN135qKHb71Hd2R2uRon4x4AcMNPWQVgEE"
  )
);
const umiSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(umiSigner));

// Create the Collection NFT.
const collectionUpdateAuthority = generateSigner(umi);
const collectionMint = generateSigner(umi);

const start = async () => {
  const temp = await createNft(umi, {
    mint: collectionMint,
    authority: collectionUpdateAuthority,
    name: "My Collection NFT",
    uri: "https://example.com/path/to/some/json/metadata.json",
    sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
    isCollection: true,
  }).sendAndConfirm(umi);
  console.log(temp);
};

start();
