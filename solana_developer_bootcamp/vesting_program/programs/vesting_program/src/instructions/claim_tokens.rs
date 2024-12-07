use crate::error::ErrorCode;
use crate::{EmployeeAccount, VestingAccount};
use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token_interface::{self, Mint, TokenAccount, TokenInterface, TransferChecked};

#[derive(Accounts)]
#[instruction(company_name: String)]
pub struct ClaimTokens<'info> {
    #[account(mut)]
    pub beneficiary: Signer<'info>,
    #[account(
        mut,
        seeds = [b"employee_vesting", beneficiary.key().as_ref(), vesting_account.key().as_ref()],
        bump = employee_account.bump,
        has_one = beneficiary,
        has_one = vesting_account
    )]
    pub employee_account: Account<'info, EmployeeAccount>,
    #[account(
        mut,
        seeds = [company_name.as_ref()],
        bump = vesting_account.bump,
        has_one = treasury_token_account,
        has_one = mint
    )]
    pub vesting_account: Account<'info, VestingAccount>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(mut)]
    pub treasury_token_account: InterfaceAccount<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = beneficiary,
        associated_token::mint = mint,
        associated_token::authority = beneficiary,
        associated_token::token_program = token_program
    )]
    pub employee_token_account: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn claim_tokens(ctx: Context<ClaimTokens>, _company_name: String) -> Result<()> {
    let employee_account = &mut ctx.accounts.employee_account;
    let now = Clock::get()?.unix_timestamp;

    // Check if the current time is before the cliff time
    if now < employee_account.cliff_time {
        return Err(ErrorCode::ClaimNotAvailableYet.into());
    }
    // Calculate the vested amount
    let time_since_start = now.saturating_sub(employee_account.start_time);
    let total_vesting_time = employee_account
        .end_time
        .saturating_sub(employee_account.start_time);
    let vested_amount = if now >= employee_account.end_time {
        employee_account.total_amount
    } else {
        (employee_account.total_amount * time_since_start) / total_vesting_time
    };

    //Calculate the amount that can be withdrawn
    let claimable_amount = vested_amount.saturating_sub(employee_account.total_withdrawn);
    // Check if there is anything left to claim
    if claimable_amount == 0 {
        return Err(ErrorCode::NothingToClaim.into());
    }
    let transfer_cpi_accounts = TransferChecked {
        from: ctx.accounts.treasury_token_account.to_account_info(),
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.employee_token_account.to_account_info(),
        authority: ctx.accounts.treasury_token_account.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let signer_seeds: &[&[&[u8]]] = &[&[
        b"vesting_treasury",
        ctx.accounts.vesting_account.company_name.as_ref(),
        &[ctx.accounts.vesting_account.treasury_bump],
    ]];
    let cpi_context = CpiContext::new(cpi_program, transfer_cpi_accounts).with_signer(signer_seeds);
    let decimals = ctx.accounts.mint.decimals;
    token_interface::transfer_checked(cpi_context, claimable_amount as u64, decimals)?;
    employee_account.total_withdrawn += claimable_amount;
    Ok(())
}
