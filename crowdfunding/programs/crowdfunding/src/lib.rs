use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("9PLX14T3S41p2wbzNtt8kUWLX2JX6kkTL2mjuwW753fC");

#[program]
pub mod crowdfunding {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        _name: String,
        _description: String,
    ) -> ProgramResult {
        let campaign = &mut ctx.accounts.campaign;
        campaign.name = _name;
        campaign.description = _description;
        campaign.amount_donated = 0;
        campaign.admin = *ctx.accounts.user.key;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, _amount: u64) -> ProgramResult {
        let campaign = &mut ctx.accounts.campaign;
        let user = &mut ctx.accounts.user;

        if campaign.admin != *user.key {
            return Err(ProgramError::IncorrectProgramId);
        }

        let rent_balance = Rent::get()?.minimum_balance(campaign.to_account_info().data_len());

        if **campaign.to_account_info().lamports.borrow() - rent_balance < _amount {
            return Err(ProgramError::InsufficientFunds);
        }

        **campaign.to_account_info().try_borrow_mut_lamports()? -= _amount;
        **user.to_account_info().try_borrow_mut_lamports()? += _amount;

        Ok(())
    }

    pub fn donate(ctx: Context<Donate>, _amount: u64) -> ProgramResult {
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.campaign.key(),
            _amount,
        );

        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.campaign.to_account_info(),
            ],
        );

        (&mut ctx.accounts.campaign).amount_donated += _amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer=user, space=9000, seeds=[b"CAMPAIGN_DEMO".as_ref(), user.key().as_ref()], bump)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Donate<'info> {
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Campaign {
    pub admin: Pubkey,
    pub name: String,
    pub description: String,
    pub amount_donated: u64,
}
