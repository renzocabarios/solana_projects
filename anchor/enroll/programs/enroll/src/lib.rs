use anchor_lang::prelude::*;

declare_id!("FDDbT6pAmifx3GffUhq67FZBEZp1ggYmhdiWwAoJRY5T");

#[program]
pub mod enroll {
    use super::*;

   pub fn initialize(ctx: Context<Initialize>, discord: String, github: String) -> Result<()> {
        let enrollment = &mut ctx.accounts.enrollment;
        enrollment.discord = discord;
        enrollment.github = github;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(content: String)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        seeds = [b"enroll"], 
        bump,                
        payer = payer,
        space = 8 + ExampleAccount::INIT_SPACE
    )]
    pub enrollment: Account<'info, Enrollment>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Enrollment {
    #[max_len(50)]
    pub discord: String, // 4 + length of string in bytes
    #[max_len(50)]
    pub github: String, // 4 + length of string in bytes
    pub bump: u8,   // 1 byte
}
