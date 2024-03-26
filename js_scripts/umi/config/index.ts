import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { RPC_URL } from "../../env";

export const UMI_INSTANCE = createUmi(RPC_URL);
