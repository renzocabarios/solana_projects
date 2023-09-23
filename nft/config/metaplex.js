import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} from "@metaplex-foundation/js";
import {
  BUNDLR_STORAGE_ADDRESS,
  BUNDLR_STORAGE_PROVIDE_URL,
  BUNDLR_STORAGE_TIMEOUT,
} from "../env/index.js";

export const BUNDLR_STORAGE = bundlrStorage({
  address: BUNDLR_STORAGE_ADDRESS,
  providerUrl: BUNDLR_STORAGE_PROVIDE_URL,
  timeout: BUNDLR_STORAGE_TIMEOUT,
});

export const METAPLEX_INSTANCE = (connection, keypairIdentity) => {
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity)
    .use(BUNDLR_STORAGE);
  return metaplex;
};

export const getKeypairIdentity = (keypair) => {
  return keypairIdentity(keypair);
};
