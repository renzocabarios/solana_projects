use anchor_lang::prelude::*;

mod instructions;
mod state;

declare_id!("Cq2gSzQBh9rFQqAhjXA2tUBx6vwQpsZdakoGRX2zNq8P");

#[program]
pub mod lending_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
