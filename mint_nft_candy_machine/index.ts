import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { Keypair, clusterApiUrl } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import {
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
  safeFetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import bs58 from "bs58";
import { createMintWithAssociatedToken } from "@metaplex-foundation/mpl-toolbox";
import { transactionBuilder, generateSigner } from "@metaplex-foundation/umi";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet.js";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

const candyMachineAddress = publicKey(
  "3s9YNzgmF2vLsSPmPKVmgEugtDEpgndbomATLeXjsdRA"
);

const keypair = Keypair.fromSecretKey(bs58.decode(""));

const wallet = new NodeWallet(keypair);
const walletIDentity = walletAdapterIdentity(wallet);

const umi = createUmi(clusterApiUrl("devnet"))
  .use(walletIDentity)
  .use(mplCandyMachine())
  .use(mplTokenMetadata());

const start = async () => {
  const candyMachine = await fetchCandyMachine(umi, candyMachineAddress);
  const candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);

  console.log(candyGuard);

  const nftMint = generateSigner(umi);
  const nftOwner = generateSigner(umi).publicKey;
  await transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 1000000 }))
    .add(createMintWithAssociatedToken(umi, { mint: nftMint, owner: nftOwner }))
    .add(
      mintV2(umi, {
        candyMachine: candyMachine.publicKey,
        candyGuard: candyGuard?.publicKey,
        nftMint: nftMint.publicKey,
        collectionMint: candyMachine.collectionMint,
        tokenStandard: candyMachine.tokenStandard,
        collectionUpdateAuthority: candyMachine.authority,
      })
    )
    .sendAndConfirm(umi);
};

start();
