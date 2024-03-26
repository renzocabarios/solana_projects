import { UMI_INSTANCE } from "./config";
import { publicKey } from "@metaplex-foundation/umi";

const main = async () => {
  const publickey = publicKey(process.argv[2]);
  const balance = await UMI_INSTANCE.rpc.getBalance(publickey);
  console.log(
    `${publickey} has SOL ${
      Number(balance.basisPoints) / 10 ** balance.decimals
    }`
  );
};

main();
