import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { PAYER_PRIVATE_KEY, RPC_URL } from "../../env";
import { keypairIdentity } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import { mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { mplCore } from "@metaplex-foundation/mpl-core";
import { mplCandyMachine } from "@metaplex-foundation/mpl-core-candy-machine";

const UMI_INSTANCE = createUmi(RPC_URL)
  .use(mplToolbox())
  .use(mplBubblegum())
  .use(irysUploader())
  .use(mplCore())
  .use(mplCandyMachine());
const decoded = base58.serialize(PAYER_PRIVATE_KEY);
const keypair = UMI_INSTANCE.eddsa.createKeypairFromSecretKey(decoded);
UMI_INSTANCE.use(keypairIdentity(keypair));

export { UMI_INSTANCE };
