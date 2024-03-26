use anchor_lang::prelude::*;

declare_id!("FbJHAAHCeHDdgPfAmt3z3HybinuLcZyra2H2CTwSkCJa");

#[program]
pub mod project_01 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &ctx.accounts.counter;
        msg!("Counter account created! Current count: {}", counter.count);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,         
        payer = payer, 
        space = 8 + 8 
    )]
    pub counter: Account<'info, Counter>,
    pub system_program: Program<'info, System>, 
}



#[account]
pub struct Counter {
    pub count: u64, 
}
