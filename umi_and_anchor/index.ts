import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Umi } from "@metaplex-foundation/umi";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { mplCandyMachine as mplCoreCandyMachine } from "@metaplex-foundation/mpl-core-candy-machine";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

(async () => {
  createUmi(connection)
    .use(irysUploader())
    .use(walletAdapterIdentity(wallet))
    .use(mplToolbox())
    .use(mplCore());

  const collection = generateSigner(umi);
  const web3jsKeypair = toWeb3JsKeypair(collection);

  const umiInstructions = createCollectionV1(umi, {
    collection: collection,
    name: "My Asset",
    uri: "https://example.com/my-asset.json",
  }).getInstructions();
})();
