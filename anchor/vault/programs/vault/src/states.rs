use anchor_lang::prelude::*;
pub const VAULT_SEED: &str = "VAULT_SEED";

#[account]
pub struct VaultAccount {
    pub vault_authority: Pubkey,
    pub amount: u64,
}

impl VaultAccount {
    pub const LEN: usize = 32 + 8;
}

#[error_code]
pub enum ErrorCode {
    #[msg("The deposited amount is not the correct value.")]
    InvalidAmount,
    #[msg("Insufficient funds for withdrawal.")]
    InsufficientFunds,
}
