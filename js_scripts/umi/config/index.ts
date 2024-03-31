import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { PAYER_PRIVATE_KEY, RPC_URL } from "../../env";
import { keypairIdentity } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";

const UMI_INSTANCE = createUmi(RPC_URL).use(mplToolbox()).use(mplBubblegum());
const decoded = base58.serialize(PAYER_PRIVATE_KEY);
const keypair = UMI_INSTANCE.eddsa.createKeypairFromSecretKey(decoded);

UMI_INSTANCE.use(keypairIdentity(keypair));

export { UMI_INSTANCE };
