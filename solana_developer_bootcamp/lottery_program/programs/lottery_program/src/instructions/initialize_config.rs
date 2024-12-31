use crate::TokenLottery;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeConifg<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 8 + TokenLottery::INIT_SPACE,
        // Challenge: Make this be able to run more than 1 lottery at a time
        seeds = [b"token_lottery".as_ref()],
        bump
    )]
    pub token_lottery: Box<Account<'info, TokenLottery>>,

    pub system_program: Program<'info, System>,
}

pub fn initialize_config(
    ctx: Context<InitializeConifg>,
    start: u64,
    end: u64,
    price: u64,
) -> Result<()> {
    ctx.accounts.token_lottery.bump = ctx.bumps.token_lottery;
    ctx.accounts.token_lottery.lottery_start = start;
    ctx.accounts.token_lottery.lottery_end = end;
    ctx.accounts.token_lottery.price = price;
    ctx.accounts.token_lottery.authority = ctx.accounts.payer.key();
    ctx.accounts.token_lottery.randomness_account = Pubkey::default();

    ctx.accounts.token_lottery.ticket_num = 0;
    ctx.accounts.token_lottery.winner_chosen = false;
    Ok(())
}
