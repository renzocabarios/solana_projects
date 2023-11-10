use anchor_lang::prelude::*;

declare_id!("4EZmVGSvLdh7J25EftVKE4rs1SwmGqnCkn4DdmbQF5oJ");

#[program]
pub mod string_saver_dapp {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, data: String) -> Result<()> {
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

#[account]
pub struct StringHolder {
    pub data: String,
}
