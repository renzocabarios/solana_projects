import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useWallet } from "@solana/wallet-adapter-react";
function useUmi() {
  const wallet = useWallet();
  const umi = createUmi("https://api.mainnet-beta.solana.com").use(
    walletAdapterIdentity(wallet)
  );

  return umi;
}

export default useUmi;
