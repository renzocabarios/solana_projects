use anchor_lang::prelude::*;

declare_id!("DSKk1maqJij5xqjFqgJNcKgo8sKgRzGZjjr1BWRFP4dP");

#[program]
pub mod express_todo {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, name: String, email: String) -> Result<()> {
        let customer = &mut ctx.accounts.customer;
        customer.name = name;
        customer.email = email;
        customer.deleted = false;
        Ok(())
    }

    pub fn update(ctx: Context<Update>, name: String, email: String) -> Result<()> {
        let customer = &mut ctx.accounts.customer;
        customer.name = name;
        customer.email = email;
        Ok(())
    }

    pub fn delete(ctx: Context<Delete>) -> Result<()> {
        let customer = &mut ctx.accounts.customer;
        customer.deleted = true;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer=signer, space=264)]
    pub customer: Account<'info, Customer>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub customer: Account<'info, Customer>,
}

#[derive(Accounts)]
pub struct Delete<'info> {
    #[account(mut)]
    pub customer: Account<'info, Customer>,
}

#[account]
pub struct Customer {
    pub name: String,
    pub email: String,
    pub deleted: bool,
}
