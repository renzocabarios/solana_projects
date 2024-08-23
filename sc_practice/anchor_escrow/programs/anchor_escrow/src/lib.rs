use anchor_lang::prelude::*;

declare_id!("8RgVEXBPA7i4Q59Xdu9fucoQXz3FKrwXWqmHXqt8HgBx");

#[program]
pub mod anchor_escrow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
