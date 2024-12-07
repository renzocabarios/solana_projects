pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("GP4S1JRsBKn87ZSpQvobsxRauRKTsj2Lvp2o2qk3h9ZM");

#[program]
pub mod vesting_program {
    use super::*;

    pub fn create_vesting_account(
        context: Context<CreateVestingAccount>,
        company_name: String,
    ) -> Result<()> {
        instructions::create_vesting_account::create_vesting_account(context, company_name)
    }

    pub fn create_employee_vesting(
        ctx: Context<CreateEmployeeAccount>,
        start_time: i64,
        end_time: i64,
        total_amount: i64,
        cliff_time: i64,
    ) -> Result<()> {
        instructions::create_employee_account::create_employee_vesting(
            ctx,
            start_time,
            end_time,
            total_amount,
            cliff_time,
        )
    }

    pub fn claim_tokens(ctx: Context<ClaimTokens>, _company_name: String) -> Result<()> {
        instructions::claim_tokens::claim_tokens(ctx, _company_name)
    }
}
