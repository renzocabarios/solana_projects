use anchor_lang::prelude::*;
use crate::states::*;

pub fn initialize_enrollment(ctx: Context<InitializeEnrollment>, discord: String, github: String) -> Result<()> {
    let enrollment = &mut ctx.accounts.enrollment;
    enrollment.discord = discord;
    enrollment.github = github;
    
    Ok(())
}

#[derive(Accounts)]
#[instruction(content: String)]
pub struct InitializeEnrollment<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        seeds = [b"enroll", payer.key().as_ref()], 
        bump,                
        payer = payer,
        space = 8 + Enrollment::INIT_SPACE
    )]
    pub enrollment: Account<'info, Enrollment>,
    pub system_program: Program<'info, System>,
}
