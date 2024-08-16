import { BN, Program, Provider } from "@coral-xyz/anchor";
import { AnchorVault, AnchorVaultIDL } from "./idl";

export const AnchorVaultProgram = new Program<AnchorVaultIDL>(AnchorVault);

export function getAnchorVaultProgram(provider: Provider) {
  return new Program<AnchorVaultIDL>(AnchorVault, provider);
}
