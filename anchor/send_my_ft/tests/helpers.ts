import { PublicKey, Signer } from "@solana/web3.js";
import { CONNECTION } from "./constants";

export function getSigners(
  signerOrMultisig: Signer | PublicKey,
  multiSigners: Signer[]
): [PublicKey, Signer[]] {
  return signerOrMultisig instanceof PublicKey
    ? [signerOrMultisig, multiSigners]
    : [signerOrMultisig.publicKey, [signerOrMultisig]];
}

export const confirm = async (signature: string): Promise<string> => {
  const block = await CONNECTION.getLatestBlockhash();
  await CONNECTION.confirmTransaction({ signature, ...block });
  return signature;
};

export function importTest(name, path) {
  describe(name, function () {
    require(path);
  });
}
export function runTest(name, callback) {
  describe(name, callback);
}
