import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Keypair, Signer, SystemProgram, Transaction } from "@solana/web3.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createInitializeMintInstruction,
  createMintToInstruction,
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MINT_SIZE,
} from "@solana/spl-token";

interface ICreateToken {
  amount: number;
  decimals: number;
}

export default function useCreateToken() {
  const anchor = useAnchorWallet();
  const { connection } = useConnection();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries();
    },
    onError(error, variables, context) {
      console.log(error);
    },
    mutationFn: async (value: ICreateToken) => {
      if (anchor) {
        const mintLen = MINT_SIZE;
        const mintKeypair = Keypair.generate();
        const mintLamports = await connection.getMinimumBalanceForRentExemption(
          mintLen
        );

        const associatedToken = getAssociatedTokenAddressSync(
          mintKeypair.publicKey,
          anchor.publicKey,
          true,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const tx = new Transaction().add(
          SystemProgram.createAccount({
            fromPubkey: anchor.publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: mintLen,
            lamports: mintLamports,
            programId: TOKEN_PROGRAM_ID,
          }),
          createInitializeMintInstruction(
            mintKeypair.publicKey,
            value.decimals,
            anchor.publicKey,
            anchor.publicKey,
            TOKEN_PROGRAM_ID
          ),
          createAssociatedTokenAccountIdempotentInstruction(
            anchor.publicKey,
            associatedToken,
            anchor.publicKey,
            mintKeypair.publicKey,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          ),
          createMintToInstruction(
            mintKeypair.publicKey,
            associatedToken,
            anchor.publicKey,
            value.amount * 10 ** value.decimals,
            [],
            TOKEN_PROGRAM_ID
          )
        );

        const blockchash = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockchash.blockhash;
        tx.feePayer = anchor?.publicKey!;

        const mintSigner: Signer = {
          publicKey: mintKeypair.publicKey,
          secretKey: mintKeypair.secretKey,
        };

        tx.partialSign(mintSigner);
        const signed = await anchor?.signTransaction(tx);
        return await connection.sendRawTransaction(signed?.serialize());
      }

      return await null;
    },
  });

  return { ...mutation };
}
