use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;
declare_id!("4VHHjyCG5NpU2pApDo2MDS8RQXKoNvHLmWKXWqDqVrp1");

#[program]
pub mod vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let deposit_account = &mut ctx.accounts.deposit_account;
        deposit_account.total_deposits = 0;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        anchor_lang::solana_program::program::invoke(
            &system_instruction::transfer(
                &ctx.accounts.payer.key(),
                &ctx.accounts.deposit_account.key(),
                amount,
            ),
            &[
                ctx.accounts.payer.to_account_info(),
                ctx.accounts.deposit_account.to_account_info(),
            ],
        )?;
        let deposit_account = &mut ctx.accounts.deposit_account;
        deposit_account.total_deposits += amount;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let deposit_account = &mut ctx.accounts.deposit_account;
        require!(
            deposit_account.total_deposits >= amount,
            ErrorCode::InsufficientFunds
        );

        deposit_account.total_deposits -= amount;

        **ctx.accounts.user.to_account_info().lamports.borrow_mut() += amount;

        **ctx
            .accounts
            .deposit_account
            .to_account_info()
            .lamports
            .borrow_mut() -= amount;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(init, seeds = [b"vault", payer.key().as_ref()], bump, payer = payer, space = 8 + 40)]
    pub deposit_account: Account<'info, DepositAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub deposit_account: Account<'info, DepositAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub deposit_account: Account<'info, DepositAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct DepositAccount {
    pub total_deposits: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The deposited amount is not the correct value.")]
    InvalidAmount,
    #[msg("Insufficient funds for withdrawal.")]
    InsufficientFunds,
}
