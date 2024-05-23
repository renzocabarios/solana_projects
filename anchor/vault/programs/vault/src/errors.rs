use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("The deposited amount is not the correct value.")]
    InvalidAmount,
    #[msg("Insufficient funds for withdrawal.")]
    InsufficientFunds,
}
