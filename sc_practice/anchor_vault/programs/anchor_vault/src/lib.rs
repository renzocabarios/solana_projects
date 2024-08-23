use anchor_lang::prelude::*;

declare_id!("3cKzn2mWkXgHbMmoSnCJxHD5sfg4nFrrH4pRAyeWTmD6");

#[program]
pub mod anchor_vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
