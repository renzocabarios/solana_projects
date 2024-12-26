use anchor_lang::prelude::*;
declare_id!("9UH8Vf6oTSzz5RsYKPyTmdKbsEU8VqVGseV5dNZC3W1Y");
#[program]
pub mod vote_program {
    use super::*;
    pub fn initialize(ctx: Context<InitializeContext>) -> Result<()> {
        ctx.accounts.state.vote = 0;
        Ok(())
    }
    pub fn upvote(ctx: Context<UpvoteContext>) -> Result<()> {
        ctx.accounts.state.vote = ctx.accounts.state.vote + 1;
        Ok(())
    }
    pub fn downvote(ctx: Context<DownvoteContext>) -> Result<()> {
        ctx.accounts.state.vote = ctx.accounts.state.vote - 1;
        Ok(())
    }
}
#[derive(Accounts)]
pub struct InitializeContext<'info> {
    #[account(init, payer = user, space = 17, seeds = [b"vote"], bump)]
    pub state: Account<'info, VoteState>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct UpvoteContext<'info> {
    #[account(mut, seeds = [b"vote"], bump)]
    pub state: Account<'info, VoteState>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct DownvoteContext<'info> {
    #[account(mut, seeds = [b"vote"], bump)]
    pub state: Account<'info, VoteState>,
    pub system_program: Program<'info, System>,
}
#[account]
pub struct VoteState {
    pub vote: i64,
    pub bump: u8,
}
