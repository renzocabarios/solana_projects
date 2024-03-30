use dotenv::dotenv;
use solana_client::rpc_client::RpcClient;
use solana_program::system_instruction;
use solana_sdk::commitment_config::CommitmentConfig;
use solana_sdk::hash::Hash;
use solana_sdk::program_pack::Pack;
use solana_sdk::signature::{Keypair, Signer};
use solana_sdk::transaction::Transaction;
use spl_token::instruction::initialize_mint;
use spl_token::state::Mint;
fn main() {
    dotenv().ok();

    let private_key: String =
        std::env::var("PAYER_PRIVATE_KEY").expect("PAYER_PRIVATE_KEY must be set.");
    let payer_keypair: Keypair = Keypair::from_base58_string(&private_key);

    let rpc_url: String = String::from("https://api.devnet.solana.com");
    let connection: RpcClient =
        RpcClient::new_with_commitment(rpc_url, CommitmentConfig::confirmed());

    let mint = Keypair::new();

    let rent_exemption_amount: u64 = connection
        .get_minimum_balance_for_rent_exemption(Mint::LEN)
        .unwrap();

    let create_account_ix: solana_sdk::instruction::Instruction =
        system_instruction::create_account(
            &payer_keypair.pubkey(),
            &mint.pubkey(),
            rent_exemption_amount,
            Mint::LEN as u64,
            &spl_token::id(),
        );

    let ix = initialize_mint(
        &spl_token::id(),
        &Signer::pubkey(&mint),
        &Signer::pubkey(&payer_keypair),
        Some(&Signer::pubkey(&payer_keypair)),
        6,
    )
    .unwrap();

    let blockhash: Hash = connection.get_latest_blockhash().unwrap();

    let create_account_tx: Transaction = Transaction::new_signed_with_payer(
        &[create_account_ix, ix],
        Some(&Signer::pubkey(&payer_keypair)),
        &[&payer_keypair, &mint],
        blockhash,
    );

    match connection.send_and_confirm_transaction(&create_account_tx) {
        Ok(sig) => loop {
            if let Ok(confirmed) = connection.confirm_transaction(&sig) {
                if confirmed {
                    println!("Transaction: {} Status: {}", sig, confirmed);
                    println!("Mint: {}", &mint.pubkey());
                    break;
                }
            }
        },
        Err(_) => println!("Error creating system account"),
    };
}
