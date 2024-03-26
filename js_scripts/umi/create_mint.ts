import { UMI_INSTANCE } from "./config";
import { generateSigner, keypairIdentity } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { PAYER_PRIVATE_KEY } from "../env";
import { createMint, mplToolbox } from "@metaplex-foundation/mpl-toolbox";
const main = async () => {
  const decoded = base58.serialize(PAYER_PRIVATE_KEY);
  const keypair = UMI_INSTANCE.eddsa.createKeypairFromSecretKey(decoded);
  UMI_INSTANCE.use(keypairIdentity(keypair));
  UMI_INSTANCE.use(mplToolbox());

  const decimals = Number(process.argv[2]);
  const mint = generateSigner(UMI_INSTANCE);

  const tx = await createMint(UMI_INSTANCE, {
    mint,
    decimals,
    mintAuthority: UMI_INSTANCE.identity.publicKey,
    freezeAuthority: UMI_INSTANCE.identity.publicKey,
  }).sendAndConfirm(UMI_INSTANCE);

  const [signature, _] = base58.deserialize(tx.signature);
  console.log(
    `Created Token ${mint.publicKey.toString()} with ${decimals} decimals`
  );
  console.log(`TX HASH ${signature}`);
};

main();
