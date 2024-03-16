use dotenv::dotenv;
use solana_client::rpc_client::RpcClient;
use solana_program::system_instruction;
use solana_sdk::commitment_config::CommitmentConfig;
use solana_sdk::hash::Hash;
use solana_sdk::signature::{Keypair, Signer};
use solana_sdk::transaction::Transaction;

fn main() {
    dotenv().ok();

    let private_key: String =
        std::env::var("PAYER_PRIVATE_KEY").expect("PAYER_PRIVATE_KEY must be set.");
    let payer_keypair: Keypair = Keypair::from_base58_string(&private_key);

    let rpc_url: String = String::from("https://api.devnet.solana.com");
    let connection: RpcClient =
        RpcClient::new_with_commitment(rpc_url, CommitmentConfig::confirmed());

    let space: usize = 0;
    let rent_exemption_amount: u64 = connection
        .get_minimum_balance_for_rent_exemption(space)
        .unwrap();

    let new_account_keypair: Keypair = Keypair::new();
    let new_account_pubkey: solana_sdk::pubkey::Pubkey = Signer::pubkey(&new_account_keypair);

    let create_account_ix: solana_sdk::instruction::Instruction =
        system_instruction::create_account(
            &Signer::pubkey(&payer_keypair),
            &new_account_pubkey,
            rent_exemption_amount,
            space as u64,
            &Signer::pubkey(&payer_keypair),
        );

    let blockhash: Hash = connection.get_latest_blockhash().unwrap();

    let create_account_tx: Transaction = Transaction::new_signed_with_payer(
        &[create_account_ix],
        Some(&Signer::pubkey(&payer_keypair)),
        &[&payer_keypair, &new_account_keypair],
        blockhash,
    );

    match connection.send_and_confirm_transaction(&create_account_tx) {
        Ok(sig) => loop {
            if let Ok(confirmed) = connection.confirm_transaction(&sig) {
                if confirmed {
                    println!("Transaction: {} Status: {}", sig, confirmed);
                    break;
                }
            }
        },
        Err(_) => println!("Error creating system account"),
    };
}
