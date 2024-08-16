import { generateRandomSeed } from "@/lib/programs";
import { EscrowProgramIDL } from "@/lib/programs/idl";
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// pub struct Make<'info> {
//     #[account(mut)]
//     pub maker: Signer<'info>,
//     #[account(
//         mint::token_program = token_program
//     )]
//     pub mint_a: InterfaceAccount<'info, Mint>,
//     #[account(
//         mint::token_program = token_program
//     )]
//     pub mint_b: InterfaceAccount<'info, Mint>,
//     #[account(
//         mut,
//         associated_token::mint = mint_a,
//         associated_token::authority = maker,
//         associated_token::token_program = token_program
//     )]
//     pub maker_ata_a: InterfaceAccount<'info, TokenAccount>,
//     #[account(
//         init,
//         payer = maker,
//         space = 8 + Escrow::INIT_SPACE,
//         seeds = [b"escrow", maker.key().as_ref(), seed.to_le_bytes().as_ref()],
//         bump
//     )]
//     pub escrow: Account<'info, Escrow>,
//     #[account(
//         init,
//         payer = maker,
//         associated_token::mint = mint_a,
//         associated_token::authority = escrow,
//         associated_token::token_program = token_program
//     )]
//     pub vault: InterfaceAccount<'info, TokenAccount>,
//     pub associated_token_program: Program<'info, AssociatedToken>,
//     pub token_program: Interface<'info, TokenInterface>,
//     pub system_program: Program<'info, System>,
// }

interface IMakeArgs {
  seed: BN;
  deposit: BN;
  receive: BN;
}

interface IMakeAccounts {
  maker: PublicKey;
  mintA: PublicKey;
  mintB: PublicKey;
  makerAtaA: PublicKey;
  escrow: PublicKey;
  vault: PublicKey;
  tokenProgram: PublicKey;
}

interface IMake {
  accounts: IMakeAccounts;
  args: IMakeArgs;
}

export default function useMake() {
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
    mutationFn: async (value: IMake) => {
      if (anchor) {
        const anchorProvider = new AnchorProvider(
          connection,
          anchor as unknown as Wallet
        );

        const program = new Program<EscrowProgramIDL>(
          EscrowProgramIDL,
          anchorProvider
        );

        const tx = await program.methods
          .make(value.args.seed, value.args.deposit, value.args.receive)
          .accounts({
            ...value.accounts,
          })
          .transaction();

        const blockchash = await connection.getLatestBlockhash();

        tx.recentBlockhash = blockchash.blockhash;
        tx.feePayer = anchor?.publicKey!;
        const signed = await anchor?.signTransaction(tx);
        return await connection.sendRawTransaction(signed?.serialize());
      }

      return await null;
    },
  });

  return { ...mutation };
}
