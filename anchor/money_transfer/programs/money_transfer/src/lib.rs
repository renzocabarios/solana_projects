use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;

declare_id!("7mFt6d9oh6rgq92BhrGcWuxje9hC2EoWNyrUUuEzKMDu");

#[program]
pub mod money_transfer {
    use super::*;

    pub fn send_money(ctx: Context<TransferLamports>, amount: u64) -> Result<()> {
        let from_account = &ctx.accounts.from;
        let to_account = &ctx.accounts.to;

        // Create the transfer instruction
        let transfer_instruction =
            system_instruction::transfer(from_account.key, to_account.key, amount);

        // Invoke the transfer instruction
        anchor_lang::solana_program::program::invoke_signed(
            &transfer_instruction,
            &[
                from_account.to_account_info(),
                to_account.clone(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[],
        )?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct TransferLamports<'info> {
    #[account(mut)]
    pub from: Signer<'info>,
    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub to: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}
