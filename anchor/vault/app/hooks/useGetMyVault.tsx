import {
  VAULT_PROGRAM_ID,
  getVaultAddress,
  getVaultByAddress,
} from "@/lib/programs/vault_program";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";

export default function useGetVaultByAddress() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const { isPending, error, data } = useQuery({
    queryKey: [publicKey?.toString()],
    queryFn: () =>
      getVaultByAddress(
        connection,
        getVaultAddress(publicKey ?? new PublicKey(""), VAULT_PROGRAM_ID)[0]
      ),
  });

  return { isPending, error, data };
}
