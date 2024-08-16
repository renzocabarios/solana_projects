// import { AnchorVault } from "@/lib/programs/idl";
// import { useConnection } from "@solana/wallet-adapter-react";
// import { PublicKey } from "@solana/web3.js";
// import { useQuery } from "@tanstack/react-query";

// export default function useGetVaultBalance(address: string) {
//   const { connection } = useConnection();

//   const query = useQuery({
//     queryFn: () => {
//       const [vault] = PublicKey.findProgramAddressSync(
//         [new PublicKey(address).toBuffer()],
//         new PublicKey(AnchorVault.address)
//       );
//       return connection.getBalance(vault);
//     },
//     queryKey: ["vault-balance"],
//   });

//   return { ...query };
// }
