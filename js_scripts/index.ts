import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const wallet = new Keypair();
const publicKey = new PublicKey(wallet.publicKey);

const getWalletBalance = async () => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const walletBalance = await connection.getBalance(publicKey);
    console.log(
      `address ${publicKey} has ${walletBalance / LAMPORTS_PER_SOL} SOL`
    );
  } catch (err: any) {}
};

const main = async () => {
  await getWalletBalance();
};

main();
