use anchor_lang::prelude::*;
use anchor_lang::system_program::transfer;
use anchor_lang::system_program::Transfer;
declare_id!("5it2J1fobXmPnZGgDPaaq5j4o4dGoFtGxGHnt9BHipHB");

#[program]
pub mod send_sol {
    use super::*;

    pub fn initialize(ctx: Context<TransferLamports>, amount: u64) -> Result<()> {
        let accounts = Transfer {
            from: ctx.accounts.signer.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
        };

        let cpi_context: CpiContext<'_, '_, '_, '_, Transfer<'_>> =
            CpiContext::new(ctx.accounts.system_program.to_account_info(), accounts);

        transfer(cpi_context, amount)
    }
}

#[derive(Accounts)]
pub struct TransferLamports<'info> {
    #[account(mut)]
    signer: Signer<'info>,
    /// CHECK:
    #[account(mut)]
    pub to: AccountInfo<'info>,
    system_program: Program<'info, System>,
}
