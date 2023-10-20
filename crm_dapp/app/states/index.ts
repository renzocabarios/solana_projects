import { create } from "zustand";
import { ICustomerStore, IWeb3Store } from "../interfaces";

export const useWeb3Store = create<IWeb3Store>((set) => ({
  wallet: null,
  setWallet: async (wallet: string) => {
    return set(() => ({
      wallet,
    }));
  },
}));


export const useCustomerStore = create<ICustomerStore>((set) => ({
  customer: [],
  setCustomer: async (customer: any[]) => {
    return set(() => ({
      customer,
    }));
  },
}));
