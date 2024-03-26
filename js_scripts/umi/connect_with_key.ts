import { UMI_INSTANCE } from "./config";
import { keypairIdentity } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { PAYER_PRIVATE_KEY } from "../env";

const main = async () => {
  const decoded = base58.serialize(PAYER_PRIVATE_KEY);
  const keypair = UMI_INSTANCE.eddsa.createKeypairFromSecretKey(decoded);
  UMI_INSTANCE.use(keypairIdentity(keypair));
  console.log(`${UMI_INSTANCE.identity.publicKey.toString()}`);
};

main();
