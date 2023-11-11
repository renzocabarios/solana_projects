use anchor_lang::prelude::*;

declare_id!("4BURzfAxaZbwk8HwBmbo3U7yQYu4Zok9bttGuXjkkWvq");

#[program]
pub mod node_string_saver {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let string_holder: &mut Account<'_, StringHolder> = &mut ctx.accounts.string_holder;
        string_holder.data = "".to_string();
        Ok(())
    }

    pub fn add(ctx: Context<Update>, data: String) -> Result<()> {
        let string_holder: &mut Account<'_, StringHolder> = &mut ctx.accounts.string_holder;
        string_holder.data = data;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer=user, space=264)]
    pub string_holder: Account<'info, StringHolder>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub string_holder: Account<'info, StringHolder>,
}

#[account]
pub struct StringHolder {
    pub data: String,
}
