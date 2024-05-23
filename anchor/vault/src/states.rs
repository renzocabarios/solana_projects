#[account]
pub struct DepositAccount {
    pub vault_author: Pubkey,
    pub total_deposits: u64,
}

impl DepositAccount {
    pub const LEN: usize = 32 + 8;
}

#[error_code]
pub enum ErrorCode {
    #[msg("The deposited amount is not the correct value.")]
    InvalidAmount,
    #[msg("Insufficient funds for withdrawal.")]
    InsufficientFunds,
}
