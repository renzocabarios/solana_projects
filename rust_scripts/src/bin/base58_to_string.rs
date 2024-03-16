use solana_sdk::{signature::Keypair, signer::Signer};

// TODO: make the private come from CLI args
fn main() {
    let secret_key = Keypair::from_base58_string(
        "22N6rusaiRnMJ2JCZxVnzw68o39iKEJRbjk9uhCRrPp6BCyan28j2ZUisBWb83xnAYTxZMfDK5AiePNr2VLReRdF",
    );

    println!("Private Key {}", Signer::pubkey(&secret_key));
}
