import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { Keypair, clusterApiUrl } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  transactionBuilder,
  publicKey,
  some,
  signerIdentity,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import {
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
  safeFetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import bs58 from "bs58";

import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet.js";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

const candyMachineAddress = publicKey(
  "48fqqiHZ2ChPGPWvES8BsK1oXX1AirHFBHt32ABZJ4bF"
);
const treasury = publicKey("6wG3XFBjjeoi8Vgdrt6p65tS6nBKgh2PBGV9gFjnPj6M");

const keypair = Keypair.fromSecretKey(bs58.decode(""));

const wallet = new NodeWallet(keypair);
const walletIDentity = walletAdapterIdentity(wallet);

const umi = createUmi(clusterApiUrl("devnet"))
  .use(walletIDentity)
  .use(mplCandyMachine())
  .use(mplTokenMetadata());

const start = async () => {
  // Fetch the Candy Machine.
  const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
  const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
  // console.log(candyMachine);
  console.log(candyGuard?.guards.solPayment);
  // const nftMint = generateSigner(umi);
  // await transactionBuilder()
  //   .add(setComputeUnitLimit(umi, { units: 800_000 }))
  //   .add(
  //     mintV2(umi, {
  //       candyMachine: candyMachine.publicKey,
  //       nftMint: publicKey("EzhM1Anf8sNxMPJwSVdUf5SCtULkhpKDuzWxocBsF2cA"),
  //       candyGuard: candyGuard?.publicKey,
  //       collectionMint: candyMachine.collectionMint,
  //       collectionUpdateAuthority: candyMachine.authority,
  //       tokenStandard: candyMachine.tokenStandard,
  //       mintArgs: {
  //         thirdPartySigner: some({ signer: thirdPartySigner }),
  //         mintLimit: some({ id: 1 }),
  //       },
  //     })
  //   )
  //   .sendAndConfirm(umi);
  // try {
  //   const nftMint = generateSigner(umi);
  //   const transaction = await transactionBuilder()
  //     .add(setComputeUnitLimit(umi, { units: 800_000 }))
  //     .add(
  //       mintV2(umi, {
  //         candyMachine: candyMachine.publicKey,
  //         candyGuard: candyGuard?.publicKey,
  //         nftMint,
  //         collectionMint: candyMachine.collectionMint,
  //         collectionUpdateAuthority: candyMachine.authority,
  //       })
  //     );
  //   const { signature } = await transaction.sendAndConfirm(umi, {
  //     confirm: { commitment: "confirmed" },
  //   });
  //   const txid = bs58.encode(signature);
  //   console.log("success", `Mint successful! ${txid}`);
  // } catch (error: any) {
  //   console.log(error.toString());
  // }
};

start();
