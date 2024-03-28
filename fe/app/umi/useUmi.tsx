import { SOLANA } from "@/config";
import { mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useWallet } from "@solana/wallet-adapter-react";

function useUmi() {
  const wallet = useWallet();

  const umi = createUmi(SOLANA.rpc)
    .use(walletAdapterIdentity(wallet))
    .use(mplBubblegum());

  return umi;
}

export default useUmi;
