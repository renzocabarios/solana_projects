import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { RPC_URL } from "../env";

const main = async () => {
  const umi = createUmi(RPC_URL);
  const endpoint = umi.rpc.getEndpoint();

  console.log(`endpoint: ${endpoint}`);
};

main();
