use anchor_lang::prelude::*;
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("B1GhYzn76d19jnczy4Pt5dXd6FSBXNdMEismRaeKvFQS");

#[program]
pub mod lottery_program {
    use super::*;

    pub fn initialize_config(
        ctx: Context<InitializeConifg>,
        start: u64,
        end: u64,
        price: u64,
    ) -> Result<()> {
        instructions::initialize_config::initialize_config(ctx, start, end, price)
    }

    pub fn initialize_lottery(ctx: Context<InitializeLottery>) -> Result<()> {
        instructions::initialize_lottery::initialize_lottery(ctx)
    }

    pub fn buy_ticket(ctx: Context<BuyTicket>) -> Result<()> {
        instructions::buy_ticket::buy_ticket(ctx)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
