// import { AnchorVault, AnchorVaultIDL } from "@/lib/programs/idl";
// import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
// import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
// import { LAMPORTS_PER_SOL } from "@solana/web3.js";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

// export default function useWithdraw() {
//   const anchor = useAnchorWallet();
//   const queryClient = useQueryClient();
//   const { connection } = useConnection();

//   const mutation = useMutation({
//     onSuccess(data, variables, context) {
//       queryClient.invalidateQueries();
//     },
//     mutationFn: async (value: number) => {
//       if (anchor) {
//         const anchorProvider = new AnchorProvider(
//           connection,
//           anchor as unknown as Wallet
//         );

//         const program = new Program<AnchorVaultIDL>(
//           AnchorVault,
//           anchorProvider
//         );
//         const tx = await program.methods
//           .withdraw(new BN(value * LAMPORTS_PER_SOL))
//           .accounts({
//             signer: anchor?.publicKey!,
//           })
//           .transaction();

//         const blockchash = await connection.getLatestBlockhash();

//         tx.recentBlockhash = blockchash.blockhash;
//         tx.feePayer = anchor?.publicKey!;
//         const signed = await anchor?.signTransaction(tx);
//         return await connection.sendRawTransaction(signed?.serialize());
//       }

//       return await null;
//     },
//   });

//   return { ...mutation };
// }
