use crate::states::*;
use anchor_lang::prelude::*;

use crate::errors::ErrorCode;
pub fn withdraw_from_vault(ctx: Context<WithdrawFromVault>, amount: u64) -> Result<()> {
    let vault_account: &mut Account<VaultAccount> = &mut ctx.accounts.vault_account;

    require!(
        vault_account.amount >= amount,
        ErrorCode::InsufficientFunds
    );

    vault_account.amount -= amount;

    **ctx.accounts.vault_authority.to_account_info().lamports.borrow_mut() += amount;

    **ctx
        .accounts
        .vault_account
        .to_account_info()
        .lamports
        .borrow_mut() -= amount;
    
    Ok(())
}

#[derive(Accounts)]
pub struct WithdrawFromVault<'info> {
    #[account(mut)]
    pub vault_authority: Signer<'info>,
    #[account(mut,    
        seeds = [
            VAULT_SEED.as_bytes(),
            vault_authority.key().as_ref(),
        ],
        bump)]
        pub vault_account: Account<'info, VaultAccount>,
}
