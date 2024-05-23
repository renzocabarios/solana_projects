use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Enrollment {
    #[max_len(50)]
    pub discord: String, // 4 + length of string in bytes
    #[max_len(50)]
    pub github: String, // 4 + length of string in bytes
    pub bump: u8, // 1 byte
}
