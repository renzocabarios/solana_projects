import { getVaultByAddress } from "@/lib/programs/vault_program";
import { useConnection } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";

export default function useGetVaultByAddress(address: PublicKey) {
  const { connection } = useConnection();

  const { isPending, error, data } = useQuery({
    queryKey: ["vaults"],
    queryFn: () => getVaultByAddress(connection, address),
  });

  return { isPending, error, data: data ?? {} };
}
