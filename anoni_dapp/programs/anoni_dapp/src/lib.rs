use anchor_lang::prelude::*;

declare_id!("APuJFWdT3ofWahwQDrAkKz5ndU8TPoTeX2QVV2rYu1NU");

#[program]
pub mod anoni_dapp {
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
    #[account(init, payer=signer, space=264)]
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
