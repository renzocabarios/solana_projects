import { create } from "zustand";
import { IWeb3Store } from "../interfaces";

export const useWeb3Store = create<IWeb3Store>((set) => ({
  wallet: null,
  setWallet: async (wallet: string) => {
    return set(() => ({
      wallet,
    }));
  },
}));
