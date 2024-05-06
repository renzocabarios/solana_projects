use anchor_lang::prelude::*;

pub mod states;
use crate::instructions::*;
pub mod instructions;
declare_id!("FDDbT6pAmifx3GffUhq67FZBEZp1ggYmhdiWwAoJRY5T");

#[program]
pub mod enroll {
    use super::*;

    pub fn initialize(
        ctx: Context<InitializeEnrollment>,
        discord: String,
        github: String,
    ) -> Result<()> {
        initialize_enrollment(ctx, discord, github)
    }
}
