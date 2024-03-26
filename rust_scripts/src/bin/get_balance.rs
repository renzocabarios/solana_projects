use solana_client::rpc_client::RpcClient;
use solana_program::pubkey::Pubkey;
use std::str::FromStr;

fn main() {
    let rpc = RpcClient::new("https://api.devnet.solana.com");
    let pubkey_str = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

    let balance = rpc
        .get_account(&Pubkey::from_str(pubkey_str).unwrap())
        .unwrap()
        .lamports;

    println!("Sol balance of {pubkey_str} is {balance}");
}
