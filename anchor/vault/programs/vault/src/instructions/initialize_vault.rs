use anchor_lang::prelude::*;

use crate::states::*;

pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
    let vault_account: &mut Account<VaultAccount> = &mut ctx.accounts.vault_account;
    vault_account.amount = 0;
    vault_account.vault_authority = ctx.accounts.vault_authority.key();
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(mut)]
    pub vault_authority: Signer<'info>,
    #[account(init, seeds = [VAULT_SEED.as_bytes(), vault_authority.key().as_ref()], bump, payer = vault_authority, space = VaultAccount::LEN + 8)]
    pub vault_account: Account<'info, VaultAccount>,
    pub system_program: Program<'info, System>,
}
