import { UMI_INSTANCE } from "./config";
import { publicKey } from "@metaplex-foundation/umi";

const main = async () => {
  const publickey = publicKey(process.argv[2]);
  const accountExists = await UMI_INSTANCE.rpc.accountExists(publickey);
  console.log(
    `${publickey.toString()} ${accountExists ? "Exists" : "Does Not Exist"}`
  );
};

main();
