import { Commitment, Connection, Keypair, PublicKey } from "@solana/web3.js";
import wallet from "../wba-wallet.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("HJ2FRiDby4UndiQLwmV3nj1iwTmSbYCNezhW7j4WWTD8");

// Recipient address
const to = new PublicKey("E2RbYDBU5GFk4xFPEYzKhrgVgodYbx8ah2KW8X7qXXw7");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromWallet = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
    const toWallet = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to
    );

    const tx = await transfer(
      connection,
      keypair,
      fromWallet.address,
      toWallet.address,
      keypair.publicKey,
      1_000_000n
    );

    console.log(tx);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
