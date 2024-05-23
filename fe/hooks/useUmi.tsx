import { SOLANA } from "@/config";
import { mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { mplCandyMachine } from "@metaplex-foundation/mpl-core-candy-machine";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { useWallet } from "@solana/wallet-adapter-react";

function useUmi() {
  const wallet = useWallet();

  const umi = createUmi(SOLANA.rpc)
    .use(walletAdapterIdentity(wallet))
    .use(irysUploader())
    .use(mplToolbox())
    .use(mplBubblegum())
    .use(mplCore())
    .use(mplCandyMachine());
  return umi;
}

export default useUmi;
