import { getAllVaults } from "@/lib/programs/vault_program";
import { useConnection } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";

export default function useGetAllVaults() {
  const { connection } = useConnection();

  const { isPending, error, data } = useQuery({
    queryKey: ["vaults"],
    queryFn: () => getAllVaults(connection),
  });

  return { isPending, error, data: data ?? [] };
}
