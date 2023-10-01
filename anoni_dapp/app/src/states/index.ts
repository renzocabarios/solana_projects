import { create } from "zustand";
import { AnchorProvider } from "@coral-xyz/anchor";
import { CONNECTION, getProgramInstance } from "../config";
import { getAllPosts } from "../fetch";
import { IProgram, IWeb3Store } from "../interfaces";

export const useWeb3Store = create<IWeb3Store>((set) => ({
  provider: null,
  wallet: null,
  posts: [],
  setProvider: () => {
    const { solana } = window as any;
    return set(() => ({
      provider: new AnchorProvider(CONNECTION, solana, {
        commitment: "processed",
      }),
    }));
  },
  setWallet: async () => {
    const { solana } = window as any;
    const response = await solana.connect();
    return set(() => ({
      wallet: response.publicKey.toString(),
    }));
  },
  getPosts: async (provider: AnchorProvider) => {
    const program: IProgram = getProgramInstance(provider);
    const data = await getAllPosts(program);
    return set(() => ({ posts: data }));
  },
}));
