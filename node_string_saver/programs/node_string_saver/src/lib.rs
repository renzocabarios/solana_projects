use anchor_lang::prelude::*;

declare_id!("LwLEiVLfLitKwkTSo6rScZspxTF1PfeEX8HBp71LCHE");

#[program]
pub mod node_string_saver {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, data: String) -> Result<()> {
        let string_holder = &mut ctx.accounts.string_holder;
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

#[account]
pub struct StringHolder {
    pub data: String,
}
