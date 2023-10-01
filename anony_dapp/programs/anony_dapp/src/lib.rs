use anchor_lang::prelude::*;

declare_id!("4mDpa7Yt2edjAvoZ7Ji5aga5LK7uzUGLa7hVhZAFWwtV");

#[program]
pub mod anony_dapp {
    use super::*;

    pub fn create_post(ctx: Context<CreatePost>, title: String, content: String) -> Result<()> {
        let post = &mut ctx.accounts.post;
        post.creator = ctx.accounts.signer.key();
        post.title = title;
        post.content = content;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + 2 + 4 + 200 + 1, seeds = [b"post", signer.key().as_ref()], bump
    )]
    pub post: Account<'info, Post>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Post {
    pub creator: Pubkey,
    pub title: String,
    pub content: String,
}
