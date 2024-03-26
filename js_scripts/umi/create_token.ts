import { UMI_INSTANCE } from "./config";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { PAYER_PRIVATE_KEY } from "../env";
import { mplToolbox, createToken } from "@metaplex-foundation/mpl-toolbox";

const main = async () => {
  const decoded = base58.serialize(PAYER_PRIVATE_KEY);
  const keypair = UMI_INSTANCE.eddsa.createKeypairFromSecretKey(decoded);
  UMI_INSTANCE.use(keypairIdentity(keypair));
  UMI_INSTANCE.use(mplToolbox());

  const mint = publicKey(process.argv[2] ?? "");
  const token = generateSigner(UMI_INSTANCE);

  const tx = await createToken(UMI_INSTANCE, {
    token,
    mint,
    owner: UMI_INSTANCE.identity.publicKey,
  }).sendAndConfirm(UMI_INSTANCE);

  const [signature, _] = base58.deserialize(tx.signature);
  console.log(
    `Created token account ${token.publicKey.toString()} for ${UMI_INSTANCE.identity.publicKey.toString()}`
  );
  console.log(`TX HASH ${signature}`);
};

main();
