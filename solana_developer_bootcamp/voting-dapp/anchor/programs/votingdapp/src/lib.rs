#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod votingdapp {
    use super::*;

    pub fn initialize_poll(
        _ctx: Context<InitializePoll>,
        poll_id: u64,
        poll_start: u64,
        poll_end: u64,
        description: String,
    ) -> Result<()> {
        let poll = &mut _ctx.accounts.poll;

        poll.poll_id = poll_id;
        poll.description = description;
        poll.poll_start = poll_start;
        poll.poll_end = poll_end;
        poll.candidate_amount = 0;

        Ok(())
    }

    pub fn initialize_candidate(
        _ctx: Context<InitializeCandidate>,
        poll_id: u64,
        candidate_name: String,
    ) -> Result<()> {
        let candidate = &mut _ctx.accounts.candidate;

        let poll = &mut _ctx.accounts.poll;

        poll.candidate_amount += 1;
        candidate.candidate_name = candidate_name;
        candidate.candidate_votes = 0;

        Ok(())
    }

    pub fn vote(_ctx: Context<Vote>, poll_id: u64, candidate_name: String) -> Result<()> {
        let candidate = &mut _ctx.accounts.candidate;
        let poll = &mut _ctx.accounts.poll;

        candidate.candidate_votes += 1;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(poll_id: u64, candidate_name: String) ]
pub struct Vote<'info> {
    #[account()]
    pub signer: Signer<'info>,

    #[account(
      mut,
      seeds = [b"poll".as_ref(), poll_id.to_le_bytes().as_ref()],
      bump
    )]
    pub poll: Account<'info, Poll>,

    #[account(
      mut,
      seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_ref()],
      bump
    )]
    pub candidate: Account<'info, Candidate>,
}

#[derive(Accounts)]
#[instruction(poll_id: u64, candidate_name: String) ]
pub struct InitializeCandidate<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub poll: Account<'info, Poll>,
    #[account(
      init,
      payer = signer,
      space = 8 + Candidate::INIT_SPACE,
      seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_ref()],
      bump
    )]
    pub candidate: Account<'info, Candidate>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
      init,
      payer = signer,
      space = 8 + Poll::INIT_SPACE,
      seeds = [b"poll".as_ref(), poll_id.to_le_bytes().as_ref()],
      bump
    )]
    pub poll: Account<'info, Poll>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Candidate {
    #[max_len(280)]
    pub candidate_name: String,
    pub candidate_votes: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
    pub poll_id: u64,
    #[max_len(280)]
    pub description: String,
    pub poll_start: u64,
    pub poll_end: u64,
    pub candidate_amount: u64,
}
