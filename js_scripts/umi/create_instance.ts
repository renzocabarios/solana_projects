import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { RPC_URL } from "../env";

const main = async () => {
  const umi = createUmi(RPC_URL);
};

main();
