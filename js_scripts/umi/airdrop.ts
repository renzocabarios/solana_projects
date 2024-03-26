import { UMI_INSTANCE } from "./config";
import { publicKey, sol } from "@metaplex-foundation/umi";

const main = async () => {
  const publickey = publicKey(process.argv[2]);
  const quantity = Number(process.argv[3] ?? 1);
  await UMI_INSTANCE.rpc.airdrop(publickey, sol(quantity));
  console.log(`airdropped ${quantity} SOL to ${publickey}`);
};

main();
