import { UMI_INSTANCE } from "./config";
import { keypairIdentity, publicKey, sol } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { PAYER_PRIVATE_KEY } from "../env";
import { transferSol } from "@metaplex-foundation/mpl-toolbox";

const main = async () => {
  const decoded = base58.serialize(PAYER_PRIVATE_KEY);
  const keypair = UMI_INSTANCE.eddsa.createKeypairFromSecretKey(decoded);
  UMI_INSTANCE.use(keypairIdentity(keypair));

  const to = publicKey(process.argv[2] ?? "");
  const quantity = Number(process.argv[3]);

  const tx = await transferSol(UMI_INSTANCE, {
    source: UMI_INSTANCE.identity,
    destination: to,
    amount: sol(quantity),
  }).sendAndConfirm(UMI_INSTANCE);

  const [signature, _] = base58.deserialize(tx.signature);
  console.log(`Sent ${quantity} SOL to ${to.toString()}`);
  console.log(`TX HASH ${signature}`);
};

main();
