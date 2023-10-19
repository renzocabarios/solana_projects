use anchor_lang::prelude::*;

declare_id!("En6BofD5Pdmv3anMUKuL7zhbaYd7urCvkeqFa11Z9SFd");

#[program]
pub mod crm_dapp {
    use super::*;

    pub fn create_customer(
        ctx: Context<CreateCustomer>,
        _first_name: String,
        _last_name: String,
        _email: String,
    ) -> Result<()> {
        let customer: &mut Account<'_, Customer> = &mut ctx.accounts.customer;
        customer.first_name = _first_name;
        customer.last_name = _last_name;
        customer.email = _email;
        customer.deleted = false;
        Ok(())
    }

    pub fn update_customer(
        ctx: Context<UpdateCustomer>,
        _first_name: String,
        _last_name: String,
        _email: String,
    ) -> Result<()> {
        let customer: &mut Account<'_, Customer> = &mut ctx.accounts.customer;
        customer.first_name = _first_name;
        customer.last_name = _last_name;
        customer.email = _email;
        Ok(())
    }

    pub fn delete_customer(ctx: Context<DeleteCustomer>) -> Result<()> {
        let customer: &mut Account<'_, Customer> = &mut ctx.accounts.customer;
        customer.deleted = true;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateCustomer<'info> {
    #[account(init, payer=signer, space=264)]
    pub customer: Account<'info, Customer>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateCustomer<'info> {
    #[account(mut)]
    pub customer: Account<'info, Customer>,
}

#[derive(Accounts)]
pub struct DeleteCustomer<'info> {
    #[account(mut)]
    pub customer: Account<'info, Customer>,
}

#[account]
pub struct Customer {
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub deleted: bool,
}
