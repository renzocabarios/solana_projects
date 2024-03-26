import { SOLANA } from "@/config";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

function useUmi() {
  const umi = createUmi(SOLANA.rpc);

  return umi;
}

export default useUmi;
