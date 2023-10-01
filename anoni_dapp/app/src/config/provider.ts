import { AnchorProvider } from "@coral-xyz/anchor";
import { CONNECTION } from "./connection";

const { solana } = window as any;
const PROVIDER: AnchorProvider = new AnchorProvider(CONNECTION, solana, {
  commitment: "processed",
});

export { PROVIDER };
