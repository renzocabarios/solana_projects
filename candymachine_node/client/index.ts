import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  transactionBuilder,
  publicKey,
  createSignerFromKeypair,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import {
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
  safeFetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import * as bs58 from "bs58";

const start = async () => {
  const CONNECTION = new Connection(clusterApiUrl("devnet"));
  const umi = createUmi(CONNECTION)
    .use(mplCandyMachine())
    .use(mplTokenMetadata());
  const myKeypair = umi.eddsa.createKeypairFromSecretKey(
    bs58.decode(
      "3e4Ve7ofQxXCLqR9iRrEXQQRJLUNKJG9FxQQdAuhzdSZy8A2QJawqQTN135qKHb71Hd2R2uRon4x4AcMNPWQVgEE"
    )
  );
  const myKeypairSigner = createSignerFromKeypair(umi, myKeypair);
  umi.use(keypairIdentity(myKeypairSigner));

  const candyMachine = await fetchCandyMachine(
    umi,
    publicKey("3xJ6DgxMYHJeT5cPm4GD1mX9Jr85EzHyKsetEChzjAjD")
  );
  // Fetch the Candy Guard.
  const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);

  const nftMint = generateSigner(umi);
  const transaction = await transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 800_000 }))
    .add(
      mintV2(umi, {
        candyMachine: candyMachine.publicKey,
        candyGuard: candyGuard?.publicKey,
        nftMint,
        collectionMint: candyMachine.collectionMint,
        collectionUpdateAuthority: candyMachine.authority,
      })
    );
  const { signature } = await transaction.sendAndConfirm(umi, {
    confirm: { commitment: "confirmed" },
  });
  const txid = bs58.encode(signature);
  console.log("success", `Mint successful! ${txid}`);
};

start();
