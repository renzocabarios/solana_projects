import { EscrowProgramIDL } from "@/lib/programs/idl";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";

export default function useGetEscrows() {
  const { connection } = useConnection();
  const anchor = useAnchorWallet();

  const query = useQuery({
    queryFn: async () => {
      if (anchor) {
        const anchorProvider = new AnchorProvider(
          connection,
          anchor as unknown as Wallet
        );

        const program = new Program<EscrowProgramIDL>(
          EscrowProgramIDL,
          anchorProvider
        );

        const data = await program.account.escrow.all();

        return data;
      }

      return await null;
    },
    queryKey: ["vault-balance"],
  });

  return { ...query };
}
