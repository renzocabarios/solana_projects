use anchor_lang::prelude::*;

declare_id!("Fj1NHpcEKdsJr76SrTXJdJF9P37hq3Dz3QiyaiC95nak");

#[program]
pub mod anchor_mint_nft {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
