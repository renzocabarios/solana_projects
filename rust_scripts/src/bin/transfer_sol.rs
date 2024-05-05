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

    let to = Keypair::new();
    let lamports_to_send = 1_000_000;

    let rpc_url: String = String::from("https://api.devnet.solana.com");
    let connection: RpcClient =
        RpcClient::new_with_commitment(rpc_url, CommitmentConfig::confirmed());

    let ix = system_instruction::transfer(
        &Signer::pubkey(&payer_keypair),
        &Signer::pubkey(&to),
        lamports_to_send,
    );

    let blockhash: Hash = connection.get_latest_blockhash().unwrap();

    let create_account_tx: Transaction = Transaction::new_signed_with_payer(
        &[ix],
        Some(&Signer::pubkey(&payer_keypair)),
        &[&payer_keypair],
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
