import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import "dotenv/config";

async function main() {
  console.log("Launching client...");

  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  let programId: PublicKey = new PublicKey(
    "FtC7yc2gbso95vrV1Fby1fWLxP7GR8jRdcrhv2M7TLae"
  );

  const decoded = bs58.decode(process.env.PRIVATE_KEY ?? "");
  const keypair = Keypair.fromSecretKey(decoded);

  console.log("--Pinging Program ", programId.toBase58());

  const instruction = new TransactionInstruction({
    keys: [{ pubkey: keypair.publicKey, isSigner: false, isWritable: false }],
    programId,
    data: Buffer.alloc(0),
  });

  await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [keypair]
  );
}

main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);
