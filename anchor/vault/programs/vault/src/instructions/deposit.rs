use crate::states::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;

pub fn deposit_to_vault(ctx: Context<DepositToVault>, amount: u64) -> Result<()> {
    let vault_account: &mut Account<VaultAccount> = &mut ctx.accounts.vault_account;

    anchor_lang::solana_program::program::invoke(
        &system_instruction::transfer(
            &ctx.accounts.vault_authority.key(),
            &vault_account.key(),
            amount,
        ),
        &[
            ctx.accounts.vault_authority.to_account_info(),
            vault_account.to_account_info(),
        ],
    )?;
    vault_account.amount += amount;
    
    Ok(())
}

#[derive(Accounts)]
pub struct DepositToVault<'info> {
    #[account(mut)]
    pub vault_authority: Signer<'info>,
    #[account(mut,    
        seeds = [
            VAULT_SEED.as_bytes(),
            vault_authority.key().as_ref(),
        ],
        bump)]
    pub vault_account: Account<'info, VaultAccount>,
    pub system_program: Program<'info, System>,
}
