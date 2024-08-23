use anchor_lang::prelude::*;

declare_id!("DzFcdk5Fu5QWvxf7xgfSWfpL2udzA6inUs92sfczpUdY");

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
