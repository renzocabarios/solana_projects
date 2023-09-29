use anchor_lang::prelude::*;

declare_id!("46bs36nRFTEdHoLaywjPgx7599WqbXeTRiJLTomZwVGT");

#[program]
pub mod pda_demo {
    use super::*;

    pub fn create_tweet(ctx: Context<CreateTweet>, content: String) -> Result<()> {
        let tweet = &mut ctx.accounts.tweet;
        tweet.creator = ctx.accounts.signer.key();
        tweet.content = content;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateTweet<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + 2 + 4 + 200 + 1, seeds = [b"tweet", signer.key().as_ref()], bump
    )]
    pub tweet: Account<'info, Tweet>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Tweet {
    pub creator: Pubkey,
    pub content: String,
}
