import {
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  ParsedAccountData,
  PublicKey,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";

const FROM_KEYPAIR = Keypair.fromSecretKey(
  bs58.decode(
    "3e4Ve7ofQxXCLqR9iRrEXQQRJLUNKJG9FxQQdAuhzdSZy8A2QJawqQTN135qKHb71Hd2R2uRon4x4AcMNPWQVgEE"
  )
);
console.log(`My public key is: ${FROM_KEYPAIR.publicKey.toString()}.`);

const SOLANA_CONNECTION = new Connection(clusterApiUrl("devnet"));
const DESTINATION_WALLET = "8TcNg37r7EuhDzNUJ8pKgcMNALVGkmSyFXdUiP4nikJP";
const MINT_ADDRESS = "pGJcBU1w1pnNHobQGWFKEC3WU8tnhz2uD8rVreXMcju"; //You must change this value!
const TRANSFER_AMOUNT = 1;

async function getNumberDecimals(mintAddress: string): Promise<number> {
  const info = await SOLANA_CONNECTION.getParsedAccountInfo(
    new PublicKey(mintAddress)
  );
  const result = (info.value?.data as ParsedAccountData).parsed.info
    .decimals as number;
  return result;
}

async function sendTokens() {
  console.log(
    `Sending ${TRANSFER_AMOUNT} ${MINT_ADDRESS} from ${FROM_KEYPAIR.publicKey.toString()} to ${DESTINATION_WALLET}.`
  );
  //Step 1
  console.log(`1 - Getting Source Token Account`);
  let sourceAccount = await getOrCreateAssociatedTokenAccount(
    SOLANA_CONNECTION,
    FROM_KEYPAIR,
    new PublicKey(MINT_ADDRESS),
    FROM_KEYPAIR.publicKey
  );
  console.log(`    Source Account: ${sourceAccount.address.toString()}`);

  console.log(`2 - Getting Destination Token Account`);
  let destinationAccount = await getOrCreateAssociatedTokenAccount(
    SOLANA_CONNECTION,
    FROM_KEYPAIR,
    new PublicKey(MINT_ADDRESS),
    new PublicKey(DESTINATION_WALLET)
  );

  console.log(
    `    Destination Account: ${JSON.stringify(
      destinationAccount.address.toString()
    )}`
  );

  console.log(`3 - Fetching Number of Decimals for Mint: ${MINT_ADDRESS}`);
  const numberDecimals = await getNumberDecimals(MINT_ADDRESS);
  console.log(`    Number of Decimals: ${numberDecimals}`);

  console.log(`4 - Creating and Sending Transaction`);
  const tx = new Transaction();
  tx.add(
    createTransferInstruction(
      sourceAccount.address,
      destinationAccount.address,
      FROM_KEYPAIR.publicKey,
      TRANSFER_AMOUNT * Math.pow(10, numberDecimals)
    )
  );

  const latestBlockHash = await SOLANA_CONNECTION.getLatestBlockhash(
    "confirmed"
  );
  tx.recentBlockhash = await latestBlockHash.blockhash;
  const signature = await sendAndConfirmTransaction(SOLANA_CONNECTION, tx, [
    FROM_KEYPAIR,
  ]);
  console.log(
    "\x1b[32m", //Green Text
    `   Transaction Success!🎉`,
    `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
  );
}

const start = async () => {
  console.log(await getNumberDecimals(MINT_ADDRESS));

  await sendTokens();
};

start();
