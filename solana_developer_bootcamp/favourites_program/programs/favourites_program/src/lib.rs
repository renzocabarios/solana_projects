use anchor_lang::prelude::*;

declare_id!("CU3NX3uKdRzzFNUi252g83YFgL6Sun96rD7nRkzsSJUa");

#[program]
pub mod favourites_program {
    use super::*;

    pub fn set_favourites(
        ctx: Context<SetFavourites>,
        number: u64,
        color: String,
        hobbies: Vec<String>,
    ) -> Result<()> {
        ctx.accounts.favourites.set_inner(Favourites {
            number,
            color,
            hobbies,
        });
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Favourites {
    pub number: u64,

    #[max_len(50)]
    pub color: String,

    #[max_len(5, 50)]
    pub hobbies: Vec<String>,
}

#[derive(Accounts)]
pub struct SetFavourites<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + Favourites::INIT_SPACE,
        seeds = [b"favourites", user.key().as_ref()],
        bump
    )]
    pub favourites: Account<'info, Favourites>,
    pub system_program: Program<'info, System>,
}

pub struct Initialize {}
