use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer};

fn main() {
    let wallet: Keypair = Keypair::new();
    let public_key: Pubkey = Signer::pubkey(&wallet);
    let secret_key: &String = &wallet.to_base58_string();

    println!("Public Key {}", public_key);
    println!("Private Key {}", secret_key);
}
