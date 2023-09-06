import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const wallet = new Keypair();

const publicKey = new PublicKey(wallet.publicKey);

const lamportsToSol = (sol: number) => {
  return sol * LAMPORTS_PER_SOL;
};
const airdropSOL = async () => {
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const airdropSignature = await connection.requestAirdrop(
      publicKey,
      lamportsToSol(2)
    );

    const latestBlockHash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
    });

    const walletBalance = await connection.getBalance(publicKey);

    console.log(
      `address ${publicKey} has ${walletBalance / LAMPORTS_PER_SOL} SOL`
    );
  } catch (err: any) {}
};

const main = async () => {
  await airdropSOL();
};

main();
