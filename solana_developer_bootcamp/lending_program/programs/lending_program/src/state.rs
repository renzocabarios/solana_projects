use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct User {
    pub owner: Pubkey,

    pub deposited_sol: u64,
    pub deposited_sol_shares: u64,

    pub borrowed_sol: u64,
    pub borrowed_sol_shares: u64,

    pub deposited_usdc: u64,
    pub deposited_usdc_shares: u64,

    pub borrowed_usdc: u64,
    pub borrowed_usdc_shares: u64,

    pub usdc_address: Pubkey,

    pub last_updated: i64,
}

#[account]
#[derive(InitSpace)]
pub struct Bank {
    pub authority: Pubkey,
    pub mint_address: Pubkey,
    pub total_deposits: u64,
    pub total_deposits_shares: u64,
    pub liquidation_threshold: u64,
    pub liquidation_bonus: u64,
    pub liquidation_close_factor: u64,
    pub max_ltv: u64,
    pub last_updated: i64,
}
