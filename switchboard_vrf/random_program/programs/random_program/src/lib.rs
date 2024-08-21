use anchor_lang::prelude::*;
use switchboard_on_demand::RandomnessAccountData;

declare_id!("9uVAUNJAgQuaAVsWE6zmVxb2kFhPLQHoNM8oUHq2WsRu");

#[program]
pub mod random_program {

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        let random_state = &mut ctx.accounts.random_state;

        random_state.random = Pubkey::default();
        random_state.bump = ctx.bumps.random_state;
        Ok(())
    }

    pub fn generate_random(ctx: Context<GenerateRandom>, randomness_account: Pubkey) -> Result<()> {
        let random_state = &mut ctx.accounts.random_state;
        RandomnessAccountData::parse(ctx.accounts.randomness_account.data.borrow()).unwrap();
        random_state.random = randomness_account;
        Ok(())
    }

    pub fn settle_random(ctx: Context<SettleRandom>) -> Result<()> {
        let random_state = &mut ctx.accounts.random_state;
        let randomness_data =
            RandomnessAccountData::parse(ctx.accounts.randomness_account.data.borrow()).unwrap();
        let clock: Clock = Clock::get()?;
        let revealed_random_value = randomness_data
            .get_value(&clock)
            .map_err(|_| ErrorCode::RandomnessNotResolved)?;

        let randomness_result = revealed_random_value[0];

        random_state.result = randomness_result;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(init, payer = signer, seeds = [b"random", signer.key().as_ref()], bump, space = 8 + 16 + 1)]
    pub random_state: Account<'info, RandomState>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GenerateRandom<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut,  seeds = [b"random", signer.key().as_ref()], bump )]
    pub random_state: Account<'info, RandomState>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub randomness_account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SettleRandom<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut,  seeds = [b"random", signer.key().as_ref()], bump )]
    pub random_state: Account<'info, RandomState>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub randomness_account: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct RandomState {
    pub random: Pubkey,
    pub result: u8,
    pub bump: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access attempt.")]
    Unauthorized,
    GameStillActive,
    NotEnoughFundsToPlay,
    RandomnessAlreadyRevealed,
    RandomnessNotResolved,
    RandomnessExpired,
}
