# create and Mint Token

### PREREQUISITES
- `Solana CLI`
- `SPL Token CLI` run `cargo install spl-token-cli`
- `Solana CLI`

### GUIDE
- run `spl-token create-token --url devnet`
- run `spl-token create-account <token-address> --url devnet`
- run `spl-token balance <token-address> --url devnet`
- run `spl-token mint <token-address> <number-of-instances> --url devnet`
- run `spl-token supply <token-address> --url devnet`
- run `spl-token authorize <token-address> mint --disable --url devnet`
- run `spl-token burn <token-account-address> <number-of-instances> --url devnet`
- run `spl-token transfer <token-address> <number-of-instances> <wallet-address> --url devnet --allow-unfunded-recipient --fund-recipient`