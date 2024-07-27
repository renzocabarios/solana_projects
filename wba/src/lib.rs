// HWv3k9SurTaiVVKwJ5btwA5WUSfPCWAGoCGMv4RWGs7K
mod programs;

#[cfg(test)]
mod tests {
    use crate::programs::wba_prereq::{CompleteArgs, UpdateArgs, WbaPrereqProgram};
    use bs58;
    use solana_client::rpc_client::RpcClient;
    use solana_sdk::message::Message;
    use solana_sdk::pubkey::Pubkey;
    use solana_sdk::signature::read_keypair_file;
    use solana_sdk::system_instruction::transfer;
    use solana_sdk::system_program;
    use solana_sdk::transaction::Transaction;
    use solana_sdk::{self, signer::Signer};
    use std::io::{self, BufRead};
    use std::str::FromStr;
    const RPC_URL: &str = "https://api.devnet.solana.com";

    #[test]
    fn keygen() {
        let kp = solana_sdk::signature::Keypair::new();
        println!("You've generated a new Solana wallet: {}", kp.pubkey());
        println!("");
        println!("To save your wallet, copy and paste the following into a JSON file:");
        println!("{:?}", kp.to_bytes())
    }
    #[test]
    fn airdop() {
        let keypair: solana_sdk::signature::Keypair =
            read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
        let client: RpcClient = RpcClient::new(RPC_URL);

        match client.request_airdrop(&keypair.pubkey(), 2_000_000_000u64) {
            Ok(s) => {
                println!("Success! Check out your TX here:");
                println!(
                    "https://explorer.solana.com/tx/{}?cluster=devnet",
                    s.to_string()
                );
            }
            Err(e) => println!("Oops, something went wrong: {}", e.to_string()),
        };
    }

    #[test]

    fn transfer_sol() {
        let to_pubkey = Pubkey::from_str("EzhM1Anf8sNxMPJwSVdUf5SCtULkhpKDuzWxocBsF2cA").unwrap();
        let keypair: solana_sdk::signature::Keypair =
            read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
        let rpc_client = RpcClient::new(RPC_URL);

        let recent_blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");
        // 100000000

        let transaction = Transaction::new_signed_with_payer(
            &[transfer(&keypair.pubkey(), &to_pubkey, 100000000)],
            Some(&keypair.pubkey()),
            &vec![&keypair],
            recent_blockhash,
        );

        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here:
                https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );

        // https://explorer.solana.com/tx/4LuXVo8xgNi7nP3Zohyp7PoyEoGjEadE4WswTwBsohszDiT3HA1sU1z86USB3NRFFeZi4DFoG6Kc6usvv6jnR7tN/?cluster=devnet
    }

    #[test]
    fn transfer_all() {
        let to_pubkey = Pubkey::from_str("EzhM1Anf8sNxMPJwSVdUf5SCtULkhpKDuzWxocBsF2cA").unwrap();
        let keypair: solana_sdk::signature::Keypair =
            read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
        let rpc_client = RpcClient::new(RPC_URL);

        let balance = rpc_client
            .get_balance(&keypair.pubkey())
            .expect("Failed to get balance");

        let recent_blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        let message = Message::new_with_blockhash(
            &[transfer(&keypair.pubkey(), &to_pubkey, balance)],
            Some(&keypair.pubkey()),
            &recent_blockhash,
        );

        let fee = rpc_client
            .get_fee_for_message(&message)
            .expect("Failed to get fee calculator");

        let transaction = Transaction::new_signed_with_payer(
            &[transfer(&keypair.pubkey(), &to_pubkey, balance - fee)],
            Some(&keypair.pubkey()),
            &vec![&keypair],
            recent_blockhash,
        );

        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here:
                https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
        // https://explorer.solana.com/tx/5GGqMjncN61QPM4iYUuewL7JhqZDWoQnUAs7CbmzkLDVJ28iUMPPapKDLKXhESno8DcFXkwaS7shP8WDEQNFXoot/?cluster=devnet
    }

    #[test]
    fn enroll() {
        let keypair: solana_sdk::signature::Keypair =
            read_keypair_file("wba-wallet.json").expect("Couldn't find wallet file");
        let rpc_client = RpcClient::new(RPC_URL);

        let prereq: Pubkey = WbaPrereqProgram::derive_program_address(&[
            b"prereq",
            keypair.pubkey().to_bytes().as_ref(),
        ]);

        let args: CompleteArgs = CompleteArgs {
            github: b"renzocabarios".to_vec(),
        };

        let recent_blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        let transaction = WbaPrereqProgram::complete(
            &[&keypair.pubkey(), &prereq, &system_program::id()],
            &args,
            Some(&keypair.pubkey()),
            &[&keypair],
            recent_blockhash,
        );

        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here:
                https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
        // https://explorer.solana.com/tx/47Unz2s6H8evZoPE98mFyag1N5xoQ6DxiDDudGuTSqL2Rbuc3PayLAkq3HZT6DkAoTyA3WNyQA9qbWqXc6F1FAYF/?cluster=devnet
    }

    #[test]
    fn base58_to_wallet() {
        println!("Input your private key as base58:");
        let stdin = io::stdin();
        let base58 = stdin.lock().lines().next().unwrap().unwrap();
        println!("Your wallet file is:");
        let wallet = bs58::decode(base58).into_vec().unwrap();
        println!("{:?}", wallet);
    }

    #[test]
    fn wallet_to_base58() {
        println!("Input your private key as a wallet file byte array:");
        let stdin = io::stdin();
        let wallet = stdin
            .lock()
            .lines()
            .next()
            .unwrap()
            .unwrap()
            .trim_start_matches('[')
            .trim_end_matches(']')
            .split(',')
            .map(|s| s.trim().parse::<u8>().unwrap())
            .collect::<Vec<u8>>();
        println!("Your private key is:");
        let base58 = bs58::encode(wallet).into_string();
        println!("{:?}", base58);
    }
}
