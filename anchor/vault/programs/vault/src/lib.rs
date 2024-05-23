use crate::instructions::*;
use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod states;

declare_id!("857qXVVHUu3rXin47Bm9y3FpLohTwBW8s8V3pkcwXa4F");

#[program]
pub mod vault {
    use super::*;

    pub fn initialize(ctx: Context<InitializeVault>) -> Result<()> {
        initialize_vault(ctx)
    }

    pub fn deposit(ctx: Context<DepositToVault>, amount: u64) -> Result<()> {
        deposit_to_vault(ctx, amount)
    }

    pub fn withdraw(ctx: Context<WithdrawFromVault>, amount: u64) -> Result<()> {
        withdraw_from_vault(ctx, amount)
    }
}
