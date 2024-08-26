use anchor_lang::prelude::*;

declare_id!("8fmkuqsatfPcd53zL5CeSzn85QPTp6xEG3Bk5sU3pmDv");

#[program]
pub mod nft_staking {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[account]
pub struct StakeConfig {
    pub points_per_stake: u8,
    pub max_stake: u8,
    pub freeze_period: u32,
    pub rewards_bump: u8,
    pub bump: u8,
}

impl Space for StakeConfig {
    const INIT_SPACE: usize = 8 + 1 * 4 + 4;
}
