use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};

declare_id!("9trVntXG2U35vSRfJjBk3zdYMvHBg45RwyW9Ao8yCPjd");

#[program]
pub mod nft_staking {
    use super::*;

    pub fn initialize(ctx: Context<InitializeConfig>, points_per_stake: u8, max_stake: u8, freeze_period: u32) -> Result<()> {
        ctx.accounts.set_config(points_per_stake, max_stake, freeze_period, &ctx.bumps)
    }
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init, 
        payer = admin,
        seeds = [b"config".as_ref()],
        bump,
        space = StakeConfig::INIT_SPACE
    )]
    pub config: Account<'info, StakeConfig>,
    #[account(
        init, 
        payer = admin,
        seeds = [b"rewards".as_ref(), config.key().as_ref()],
        bump,
        mint::decimals = 6,
        mint::authority= config,
    )]
    pub rewards_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>
}

impl<'info> InitializeUser<'info> {

    pub fn set_config(&mut self, points_per_stake: u8, max_stake: u8, freeze_period: u32, bumps: &InitializeConfigBumps) -> Result<()>{
        self.config.set_inner(StakeConfig { points_per_stake, max_stake, freeze_period , rewards_bump: bumps.rewards_mint, bump: bumps.config });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init, 
        payer = admin,
        seeds = [b"config".as_ref()],
        bump,
        space = StakeConfig::INIT_SPACE
    )]
    pub config: Account<'info, StakeConfig>,
    #[account(
        init, 
        payer = admin,
        seeds = [b"rewards".as_ref(), config.key().as_ref()],
        bump,
        mint::decimals = 6,
        mint::authority= config,
    )]
    pub rewards_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>
}

impl<'info> InitializeConfig<'info> {
    pub fn set_config(&mut self, points_per_stake: u8, max_stake: u8, freeze_period: u32, bumps: &InitializeConfigBumps) -> Result<()>{
        self.config.set_inner(StakeConfig { points_per_stake, max_stake, freeze_period , rewards_bump: bumps.rewards_mint, bump: bumps.config });
        Ok(())
    }
}



#[account]
pub struct UserAccount{
    pub points: u32,
    pub amount_staked: u8,
    pub bump: u8,
}

impl Space for UserAccount {
    const INIT_SPACE: usize = 8 + 4 + 1 * 2;
}

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
