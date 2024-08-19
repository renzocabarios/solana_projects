use anchor_lang::prelude::*;

declare_id!("8c3EenM7ZSzEpC121jPdbrKgvQxM1iBaXjfHyzZuG1V2");

pub mod contexts;
pub use contexts::*;

#[program]
pub mod anchor_vault {
    use super::*;

    pub fn deposit(ctx: Context<Vault>, lamports: u64) -> Result<()> {
        ctx.accounts.deposit(lamports)
    }

    pub fn withdraw(ctx: Context<Vault>, lamports: u64) -> Result<()> {
        ctx.accounts.withdraw(lamports, &[ctx.bumps.vault])
    }
}
