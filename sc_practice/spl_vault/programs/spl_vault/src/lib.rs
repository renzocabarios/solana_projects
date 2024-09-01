use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked},
};

declare_id!("3H5WRpBTw2CFY9JNuiPZU6zSx2YQxc73Don8UipCgDYh");

#[program]
pub mod spl_vault {
    use super::*;

    pub fn create_vault(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        ctx.accounts.deposit(amount)
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        ctx.accounts.deposit(amount)
    }
}


#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mint::token_program = token_program
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        associated_token::mint = mint,
        associated_token::authority = signer,
        associated_token::token_program = token_program,
    )]
    pub signer_ata: InterfaceAccount<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [b"vault", signer.key().as_ref()],
        bump = vau
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = vault,
        associated_token::token_program = token_program,
    )]
    pub vault_ata: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mint::token_program = token_program
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        associated_token::mint = mint,
        associated_token::authority = signer,
        associated_token::token_program = token_program,
    )]
    pub signer_ata: InterfaceAccount<'info, TokenAccount>,
    #[account(
        init,
        payer = signer,
        space = Vault::INIT_SPACE + 8,
        seeds = [b"vault", signer.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = vault,
        associated_token::token_program = token_program,
    )]
    pub vault_ata: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> Deposit<'info> {

    pub fn create_vault(&mut self, amount: u64) -> Result<()> {

    }

    pub fn deposit(&mut self, amount: u64) -> Result<()> {
        let accounts = TransferChecked {
            from: self.signer_ata.to_account_info(),
            mint: self.mint.to_account_info(),
            to: self.vault_ata.to_account_info(),
            authority: self.signer.to_account_info(),
        };

        let ctx = CpiContext::new(self.token_program.to_account_info(), accounts);

        transfer_checked(ctx, amount, self.mint.decimals)
    }
}

impl<'info> Withdraw<'info> {
    pub fn deposit(&mut self, amount: u64) -> Result<()> {
        let accounts = TransferChecked {
            from: self.signer_ata.to_account_info(),
            mint: self.mint.to_account_info(),
            to: self.vault_ata.to_account_info(),
            authority: self.signer.to_account_info(),
        };

        let ctx = CpiContext::new(self.token_program.to_account_info(), accounts);

        transfer_checked(ctx, amount, self.mint.decimals)
    }

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub owner: Pubkey,
    pub bump: u8,
}
