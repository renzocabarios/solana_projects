import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { create } from "zustand";
import { idl, PROGRAM_ID, CONNECTION } from "../config";

export default create((set) => ({
  provider: null,
  wallet: null,
  program: null,
  getProvider: () => {
    if ("solana" in window) {
      const { solana } = window as any;
      const provider = new AnchorProvider(CONNECTION, solana, {
        commitment: "processed",
      });
      set(() => ({ provider }));
    }
  },
  connectWallet: async () => {
    const { solana } = window as any;
    try {
      const wallet = (await solana.connect()).publicKey.toString();
      set(() => {
        return { wallet };
      });
    } catch (_) {}
  },
}));
