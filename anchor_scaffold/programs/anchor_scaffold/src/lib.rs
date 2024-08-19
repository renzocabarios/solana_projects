use anchor_lang::prelude::*;

declare_id!("HPH6jTkYaju7UrJzH3KQieffiSyV1XyyWmLPADasg4NS");

#[program]
pub mod anchor_scaffold {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
