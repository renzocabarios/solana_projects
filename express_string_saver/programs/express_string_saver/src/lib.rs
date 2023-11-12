use anchor_lang::prelude::*;

declare_id!("DgYFnBtV7hVEGZbiByNkE5CLaPyJyeWH9e3jXiznq4rN");

#[program]
pub mod express_string_saver {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let string_holder: &mut Account<'_, StringHolder> = &mut ctx.accounts.string_holder;
        string_holder.data = "".to_string();
        Ok(())
    }

    pub fn update(ctx: Context<Update>, data: String) -> Result<()> {
        let string_holder: &mut Account<'_, StringHolder> = &mut ctx.accounts.string_holder;
        string_holder.data = data;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer=signer, space=264)]
    pub string_holder: Account<'info, StringHolder>,
    #[account(mut)]
    pub signer: Signer<'info>,
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
